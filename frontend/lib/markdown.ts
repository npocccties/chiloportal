import { JSONSchema } from "json-schema-to-ts";
import { join } from "node:path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { VFile } from "vfile";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Frontmatter, Post, Menu, Page, Custom } from "schemas";

export type Markdown<T extends Frontmatter = Frontmatter> = VFile & {
  data: Required<VFile["data"]> & { matter: T };
};
export type MarkdownResult<T extends Frontmatter["type"]> = Markdown<
  T extends "post"
    ? Post
    : T extends "menu"
      ? Menu
      : T extends "custom"
        ? Custom
        : Page
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

/** ページか否か判定する関数 */
export const isCustom = (markdown: Markdown): markdown is Markdown<Custom> =>
  markdown.data.matter.type === "custom";

/** おしらせをソートする関数 */
function sortPosts(posts: Markdown<Post>[]): Markdown<Post>[] {
  return posts.sort(
    (a, b) =>
      new Date(b.data.matter.datePublished).getTime() -
      new Date(a.data.matter.datePublished).getTime(),
  );
}

/** メニューをソートする関数 */
function sortMenus(menus: Markdown<Menu>[]): Markdown<Menu>[] {
  return menus.sort((a, b) => b.data.matter.order - a.data.matter.order);
}

/** 発行機関別に抽出する関数 */
function filterByIssuer(
  markdowns: Markdown[],
  allIssuer: boolean,
  issuerId?: number,
): Markdown[] {
  if (allIssuer) return markdowns;
  return issuerId
    ? markdowns.filter((markdown) => markdown.data.matter.issuerId === issuerId)
    : markdowns.filter(
        (markdown) => markdown.data.matter.issuerId === undefined,
      );
}

/**
 * ディレクトリ内のマークダウンファイルの内容を取得する関数
 * @params options.type マークダウンファイルの種類
 * @params options.sort ソートするか否か
 * @params options.issuerId 発行者の識別子（未指定ならば大学連携とみなす）
 * @params options.allIssuer 大学連携を含むすべての発行機関のファイルを得るか否か
 * @returns VFile の配列
 */
export async function readMarkdowns<T extends Frontmatter["type"]>({
  type,
  sort,
  issuerId,
  allIssuer = false,
}: {
  type: T;
  sort: boolean;
  issuerId?: number;
  allIssuer?: boolean;
}): Promise<Error | MarkdownResult<T>[]> {
  const dirname = "contents";
  const contents = await fg.async(join(dirname, "**", "*.md"));
  const dirPath = contents.length > 0 ? dirname : "examples";
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
  const issuerMarkdowns = filterByIssuer(markdowns, allIssuer, issuerId);
  if (type === "post") {
    const posts = issuerMarkdowns.filter(isPost);
    return (sort ? sortPosts(posts) : posts) as MarkdownResult<T>[];
  }
  if (type === "menu") {
    const menus = issuerMarkdowns.filter(isMenu);
    return (sort ? sortMenus(menus) : menus) as MarkdownResult<T>[];
  }
  if (type === "custom") {
    const customs = issuerMarkdowns.filter(isCustom);
    return customs as MarkdownResult<T>[];
  }
  return issuerMarkdowns.filter(isPage) as MarkdownResult<T>[];
}
