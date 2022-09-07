import aspida from "@aspida/fetch";
import api from "../api/$api";
import { restGet } from "./rest";

const client = api(
  aspida(fetch, { baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })
);

export const handlers = [
  restGet(client.consumer, (_req, res, ctx) => {
    return res(
      ctx.json({
        consumer_id: 101,
        name: "consumer101",
        url: "https://example.com/consumer101/",
        email: "consumer101@example.com",
      })
    );
  }),
  restGet(client.consumer.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          consumer_id: 101,
          name: "consumer101",
          url: "https://example.com/consumer101/",
          email: "consumer101@example.com",
        },
      ])
    );
  }),
  restGet(client.category, (_req, res, ctx) => {
    return res(
      ctx.json({
        category_id: 101,
        category1_name: "category1011",
        category2_name: "category1012",
        category3_name: "category1013",
      })
    );
  }),
  restGet(client.category.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          category_id: 101,
          category1_name: "category1011",
          category2_name: "category1012",
          category3_name: "category1013",
        },
      ])
    );
  }),
  restGet(client.categorisedBadge, (_req, res, ctx) => {
    return res(
      ctx.json({
        category_id: 101,
        consumer_id: 101,
        badge_id: 101,
        target_occupations_id: 101,
        target_job_level_id: 101,
        description: "categorised badge description...",
      })
    );
  }),
  restGet(client.target_occupations, (_req, res, ctx) => {
    return res(
      ctx.json({
        target_occupations_id: 101,
        name: "targetOccupations101",
        description: "TargetOccupations101 description...",
      })
    );
  }),
  restGet(client.target_job_level, (_req, res, ctx) => {
    return res(
      ctx.json({
        target_job_level_id: 101,
        name: "targetJobLevel101",
        description: "targetJobLevel101 description...",
      })
    );
  }),
  restGet(client.find, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          category: {},
          consumer: {},
          badge: {},
          target_occupations: {},
          target_job_level: {},
          description: "categorised badge description...",
        },
      ])
    );
  }),
  restGet(client.find.target_occupations, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          category: {},
          consumer: {},
          badge: {},
          target_occupations: {},
          target_job_level: {},
          description: "categorised badge description...",
        },
      ])
    );
  }),
  restGet(client.find.target_job_level, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          category: {},
          consumer: {},
          badge: {},
          target_occupations: {},
          target_job_level: {},
          description: "categorised badge description...",
        },
      ])
    );
  }),
  restGet(client.find.badges, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          category: {},
          consumer: {},
          badge: {},
          target_occupations: {},
          target_job_level: {},
          description: "categorised badge description...",
        },
      ])
    );
  }),
  restGet(client.badges, (_req, res, ctx) => {
    return res(
      ctx.json({
        badge_id: 101,
        name: "degitalbadge101",
        image: "degitalbadge101.jpg",
      })
    );
  }),
  restGet(client.badges.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          type: "knowledge",
          name: "degitalbadge101",
          description: "degitalbadge101_description",
          image: "degitalbadge101.jpg",
          degital_badge_class_id: "degitalbadge_classID",
          detail: {
            course_type: "course type",
            course_name: "course name",
          },
          url: "https://example/knowledge/url/sample",
        },
      ])
    );
  }),
  restGet(client.badges.consumer, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          consumer_id: 101,
          name: "consumer101",
          url: "https://example.com/consumer101/",
          email: "consumer101@example.com",
        },
      ])
    );
  }),
  restGet(client.badges.course, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          type: "course_type101",
          name: "course_name101",
        },
      ])
    );
  }),
];
