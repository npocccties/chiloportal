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
          url: { type: "string", format: "url" },
        },
        required: ["name", "url"],
        additionalProperties: false,
      },
    },
  },
  required: [],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof Config>;
