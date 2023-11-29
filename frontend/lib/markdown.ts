import { JSONSchema } from "json-schema-to-ts";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { VFile } from "vfile";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Frontmatter, Post, Menu, Page } from "schemas";

export type Markdown<T extends Frontmatter = Frontmatter> = VFile & {
  data: Required<VFile["data"]> & { matter: T };
};
export type MarkdownResult<T extends Frontmatter["type"]> = Markdown<
  T extends "post" ? Post : T extends "menu" ? Menu : Page
>;

/** おしらせか否か判定する関数 */
export const isPost = (markdown: Markdown): markdown is Markdown<Post> =>
  markdown.data.matter.type === "post";

/** メニューか否か判定する関数 */
export const isMenu = (markdown: Markdown): markdown is Markdown<Menu> =>
  markdown.data.matter.type === "menu";

/** ページか否か判定する関数 */
export const isPage = (markdown: Markdown): markdown is Markdown<Page> =>
  markdown.data.matter.type === "page";

/** おしらせをソートする関数 */
export function sortPosts(posts: Markdown<Post>[]): Markdown<Post>[] {
  return posts.sort(
    (a, b) =>
      new Date(b.data.matter.datePublished).getTime() -
      new Date(a.data.matter.datePublished).getTime(),
  );
}

/** メニューをソートする関数 */
export function sortMenus(menus: Markdown<Menu>[]): Markdown<Menu>[] {
  return menus.sort((a, b) => b.data.matter.order - a.data.matter.order);
}

/**
 * ディレクトリ内のマークダウンファイルの内容を取得する関数
 * @params dirname マークダウンファイルが存在するディレクトリ名
 * @params options.type マークダウンファイルの種類
 * @params options.sort ソートするか否か
 * @returns VFile の配列
 */
export async function readMarkdowns<T extends Frontmatter["type"]>({
  type,
  sort,
}: {
  type: T;
  sort: boolean;
}): Promise<Error | MarkdownResult<T>[]> {
  const dirname = "contents";
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
    { type: "array", items: Frontmatter } satisfies JSONSchema,
    markdowns.map((markdown) => markdown.data.matter),
  );
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (type === "post") {
    const posts = markdowns.filter(isPost);
    return (sort ? sortPosts(posts) : posts) as MarkdownResult<T>[];
  }
  if (type === "menu") {
    const menus = markdowns.filter(isMenu);
    return (sort ? sortMenus(menus) : menus) as MarkdownResult<T>[];
  }
  return markdowns.filter(isPage) as MarkdownResult<T>[];
}
