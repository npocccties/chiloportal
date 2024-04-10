import { JSONSchema, FromSchema } from "json-schema-to-ts";

export const Post = {
  type: "object",
  properties: {
    type: { const: "post" },
    title: { type: "string" },
    issuerId: { type: "number" },
    slug: { type: "string" },
    datePublished: { type: "string", format: "date" },
  },
  required: ["type", "title", "slug", "datePublished"],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type Post = FromSchema<typeof Post>;
