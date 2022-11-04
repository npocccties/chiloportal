import { FromSchema } from "json-schema-to-ts";

export const Config = {
  type: "object",
  properties: {
    recommendedWisdomBadgesIds: {
      type: "array",
      items: { type: "number" },
    },
    learningContents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { enum: ["public", "private"] },
          url: { type: "string", format: "url" },
          description: { type: "string" },
        },
        required: ["name", "type", "url", "description"],
        additionalProperties: false,
      },
    },
  },
  required: [],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof Config>;
