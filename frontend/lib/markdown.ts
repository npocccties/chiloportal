import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { VFile } from "vfile";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Frontmatters } from "schemas/frontmatter";

export type Markdown = VFile & { data: Required<VFile["data"]> };

/**
 * ディレクトリ内のマークダウンファイルの内容を取得する関数
 * @params dirname マークダウンファイルが存在するディレクトリ名
 * @params sort 公開日順にソートするか否か
 * @returns VFile の配列
 */
export async function readMarkdowns(
  dirname: string,
  sort: boolean = false,
): Promise<Error | Markdown[]> {
  const overrides = await readdir("overrides");
  const path = overrides.some((override) => override === dirname)
    ? join("overrides", dirname)
    : dirname;
  const filenames = await readdir(path);
  if (filenames.length === 0) return [];
  const files = await Promise.all(
    filenames.map((filename) =>
      read(join(path, filename), "utf8").then((file) => {
        matter(file, { strip: true });
        return file as Markdown;
      }),
    ),
  );
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(
    Frontmatters,
    files.map((file) => file.data.matter),
  );
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (sort)
    return files.sort(
      (a, b) =>
        new Date(b.data.matter.datePublished ?? "1970-01-01").getTime() -
        new Date(a.data.matter.datePublished ?? "1970-01-01").getTime(),
    );
  return files;
}
