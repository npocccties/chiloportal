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
 * @params dirpath マークダウンファイルが存在するディレクトリのパス
 * @sort 公開日順にソートするか否か
 * @returns VFile の配列
 */
export async function readMarkdowns(
  dirpath: string,
  sort: boolean = false
): Promise<Error | Markdown[]> {
  const filenames = await readdir(dirpath);
  if (filenames.length === 1 && filenames[0] === ".keep") return [];
  const files = await Promise.all(
    filenames
      .filter((filename) => filename !== ".keep")
      .map((filename) =>
        read(join(dirpath, filename), "utf8").then(
          (file) => matter(file, { strip: true }) as Markdown
        )
      )
  );
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(
    Frontmatters,
    files.map((file) => file.data.matter)
  );
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (sort)
    return files.sort(
      (a, b) =>
        new Date(b.data.matter.datePublished ?? "1970-01-01").getTime() -
        new Date(a.data.matter.datePublished ?? "1970-01-01").getTime()
    );
  return files;
}
