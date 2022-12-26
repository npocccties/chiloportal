import { FromSchema } from "json-schema-to-ts";

export const Frontmatters = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      datePublished: { type: "string", format: "date" },
    },
    required: ["title", "slug"],
    additionalProperties: false,
  },
} as const;

export type Frontmatters = FromSchema<typeof Frontmatters>;
