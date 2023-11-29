import { JSONSchema, FromSchema } from "json-schema-to-ts";

export const Page = {
  type: "object",
  properties: {
    type: { const: "page" },
    title: { type: "string" },
    slug: { type: "string" },
  },
  required: ["type", "title", "slug"],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type Page = FromSchema<typeof Page>;
