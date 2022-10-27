import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Markdowns } from "schemas/markdown";

/**
 * ディレクトリ内のマークダウンファイルの付帯情報を取得する関数
 * @params dirpath マークダウンファイルが存在するディレクトリのパス
 * @sort 公開日順にソートするか否か
 * @returns ディレクトリ内のマークダウンファイルの付帯情報
 */
export async function readMarkdowns(
  dirpath: string,
  sort: boolean = false
): Promise<Error | Markdowns> {
  const filenames = await readdir(dirpath);
  const files = await Promise.all(
    filenames.map((filename) => readFile(join(dirpath, filename), "utf8"))
  );
  const frontmatters = files.map((file) => matter(file).data);
  const markdowns = filenames.map((filename, index) => ({
    filename,
    body: files[index],
    ...frontmatters[index],
  })) as Markdowns;
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(Markdowns, markdowns);
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (sort)
    return markdowns.sort(
      (a, b) =>
        new Date(b.datePublished ?? "1970-01-01").getTime() -
        new Date(a.datePublished ?? "1970-01-01").getTime()
    );
  return markdowns;
}
