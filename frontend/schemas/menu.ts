import { JSONSchema, FromSchema } from "json-schema-to-ts";

export const Menu = {
  type: "object",
  properties: {
    type: { const: "menu" },
    title: { type: "string" },
    slug: { type: "string" },
    order: { type: "number" },
  },
  required: ["type", "title", "slug", "order"],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type Menu = FromSchema<typeof Menu>;
