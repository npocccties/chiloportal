import { timingSafeEqual } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { REVALIDATE_SECRET } from "lib/env";
import { readMarkdowns } from "lib/markdown";

/**
 * 管理画面で保存したときに、バックエンドから呼ばれてページを作り直す（オンデマンド再生成）。
 *
 * POST /api/revalidate
 * Authorization: Bearer <REVALIDATE_SECRET>
 * { "issuer_ids": [1, 2] }
 *
 * 指定した機関のページ（/issuers/番号）と、その機関のお知らせのページを作り直す。
 */
type Body = { issuer_ids?: unknown };

type Result = { revalidated: string[]; failed: string[] };

function authorized(req: NextApiRequest): boolean {
  if (!REVALIDATE_SECRET) return false;
  const expected = Buffer.from(`Bearer ${REVALIDATE_SECRET}`);
  const actual = Buffer.from(req.headers.authorization ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function pathsOfIssuer(issuerId: number): Promise<string[]> {
  const paths = [`/issuers/${issuerId}`];
  const posts = await readMarkdowns({ type: "post", sort: false, issuerId });
  if (!(posts instanceof Error)) {
    for (const post of posts) {
      paths.push(`/issuers/${issuerId}/posts/${post.data.matter.slug}`);
    }
  }
  return paths;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | string>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("405 Method Not Allowed");
  }
  if (!authorized(req)) return res.status(401).send("401 Unauthorized");
  const { issuer_ids: issuerIds } = (req.body ?? {}) as Body;
  if (
    !Array.isArray(issuerIds) ||
    !issuerIds.every((id) => Number.isSafeInteger(id) && id > 0)
  ) {
    return res.status(400).send("400 Bad Request");
  }
  const result: Result = { revalidated: [], failed: [] };
  for (const issuerId of new Set(issuerIds as number[])) {
    for (const path of await pathsOfIssuer(issuerId)) {
      try {
        await res.revalidate(path);
        result.revalidated.push(path);
      } catch {
        // ページのない機関（contents に設定がないなど）は作り直せないので、失敗として返す
        result.failed.push(path);
      }
    }
  }
  return res.status(200).json(result);
}
