import { FromSchema } from "json-schema-to-ts";

export const Markdowns = {
  type: "array",
  items: {
    type: "object",
    properties: {
      filename: { type: "string" },
      body: { type: "string" },
      title: { type: "string" },
      slug: { type: "string" },
      datePublished: { type: "string", format: "date" },
    },
    required: ["filename", "body", "title", "slug"],
    additionalProperties: false,
  },
} as const;

export type Markdowns = FromSchema<typeof Markdowns>;
