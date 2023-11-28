import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { VFile } from "vfile";
import fg from "fast-glob";
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
  const dirPath = overrides.some((override) => override === dirname)
    ? join("overrides", dirname)
    : dirname;
  const filePaths = await fg.async(join(dirPath, "**", "*.md"));
  if (filePaths.length === 0) return [];
  const markdowns = await Promise.all(
    filePaths.map((filePath) =>
      read(filePath, "utf8").then((markdown) => {
        matter(markdown, { strip: true });
        return markdown as Markdown;
      }),
    ),
  );
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(
    Frontmatters,
    markdowns.map((markdown) => markdown.data.matter),
  );
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (sort)
    return markdowns.sort(
      (a, b) =>
        new Date(b.data.matter.datePublished ?? "1970-01-01").getTime() -
        new Date(a.data.matter.datePublished ?? "1970-01-01").getTime(),
    );
  return markdowns;
}
