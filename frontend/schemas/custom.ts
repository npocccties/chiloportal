import { JSONSchema, FromSchema } from "json-schema-to-ts";

export const Custom = {
  type: "object",
  properties: {
    type: { const: "custom" },
    issuerId: { type: "number" },
  },
  required: ["type"],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type Custom = FromSchema<typeof Custom>;
