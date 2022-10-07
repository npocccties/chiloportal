import { client } from "lib/client";
import { restGet } from "./rest";
import { faker } from "@faker-js/faker";
import {
  consumer,
  field,
  portalCategory,
  wisdomBadges,
  knowledgeBadges,
  framework,
  stage,
  criteria,
} from "./faker";

export const handlers = [
  restGet(client.consumer, (_req, res, ctx) => res(ctx.json(consumer()))),
  restGet(client.consumer.list, (_req, res, ctx) =>
    res(ctx.json([...Array(10)].map(consumer)))
  ),
  restGet(client.framework.field.list, (_req, res, ctx) =>
    res(ctx.json([...Array(3)].map(field)))
  ),
  restGet(client.stage.field.list, (_req, res, ctx) =>
    res(ctx.json([...Array(3)].map(field)))
  ),
  restGet(client.portalCategory.list, (_req, res, ctx) =>
    res(ctx.json([...Array(10)].map(portalCategory)))
  ),
  restGet(client.portalCategory.badges.list, (_req, res, ctx) =>
    res(
      ctx.json({
        badges: [...Array(30)].map(wisdomBadges),
        total_count: faker.datatype.number(),
        start: faker.datatype.number(),
        end: faker.datatype.number(),
      })
    )
  ),
  restGet(client.framework, (_req, res, ctx) => res(ctx.json(framework()))),
  restGet(client.framework.stage.list, (_req, res, ctx) =>
    res(ctx.json([...Array(3)].map(stage)))
  ),
  restGet(client.badges, (req, res, ctx) => {
    switch (req.url.searchParams.get("badges_type")) {
      case "wisdom":
        return res(ctx.json([...Array(10)].map(wisdomBadges)));
      case "knowledge":
        return res(ctx.json([...Array(10)].map(knowledgeBadges)));
      default:
        return res(ctx.status(400));
    }
  }),
  restGet(client.wisdomBadges.list, (_req, res, ctx) =>
    res(
      ctx.json({
        badges: [...Array(3)].map(wisdomBadges),
      })
    )
  ),
  restGet(client.wisdomBadges.list.keyword, (_req, res, ctx) =>
    res(
      ctx.json({
        badges: [...Array(30)].map(wisdomBadges),
        total_count: faker.datatype.number(),
        start: faker.datatype.number(),
        end: faker.datatype.number(),
      })
    )
  ),
  restGet(client.wisdomBadges.consumer.list, (_req, res, ctx) =>
    res(ctx.json([...Array(10)].map(consumer)))
  ),
  restGet(client.knowledgeBadges.criteria.list, (_req, res, ctx) =>
    res(ctx.json([...Array(10)].map(criteria)))
  ),
  restGet(client.consumer.framework.list, (_req, res, ctx) =>
    res(ctx.json([...Array(3)].map(framework)))
  ),
];
