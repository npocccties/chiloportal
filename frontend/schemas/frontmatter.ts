import { JSONSchema, FromSchema } from "json-schema-to-ts";
import { Post } from "./post";
import { Menu } from "./menu";
import { Page } from "./page";
import { Custom } from "./custom";

export const Frontmatter = {
  oneOf: [Post, Menu, Page, Custom],
} as const satisfies JSONSchema;

export type Frontmatter = FromSchema<typeof Frontmatter>;
