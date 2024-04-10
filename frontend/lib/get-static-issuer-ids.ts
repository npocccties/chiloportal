import { Issuer } from "api/@types";
import { readMarkdowns } from "lib/markdown";
import { readConfigs } from "lib/config";

/**
 * 静的コンテンツから得られるひととおりの発行機関の識別子を返す関数（要：サーバーサイドでの実行）
 * @returns 発行機関の識別子の配列
 */
export default async function getStaticIssuerIds(): Promise<
  Issuer["issuer_id"][]
> {
  const [markdowns, configs] = await Promise.all([
    readMarkdowns({ type: "post", sort: false, allIssuer: true }),
    readConfigs({ allIssuer: true }),
  ]);
  if (markdowns instanceof Error) return [];
  if (configs instanceof Error) return [];
  const issuerIds = new Set<number>();
  for (const markdown of markdowns) {
    if (!markdown.data.matter.issuerId) continue;
    issuerIds.add(markdown.data.matter.issuerId);
  }
  for (const config of configs) {
    if (!config.issuerId) continue;
    issuerIds.add(config.issuerId);
  }
  return Array.from(issuerIds);
}
