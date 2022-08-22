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
        consumer_name: "consumer101",
        consumer_url: "https://example.com/consumer101/",
        consumer_mailaddr: "consumer101@example.com",
      })
    );
  }),
  restGet(client.consumer.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          consumer_id: 101,
          consumer_name: "consumer101",
          consumer_url: "https://example.com/consumer101/",
          consumer_mailaddr: "consumer101@example.com",
        },
      ])
    );
  }),
  restGet(client.categoly, (_req, res, ctx) => {
    return res(
      ctx.json({
        categoly_id: 101,
        categoly1_name: "categoly1011",
        categoly2_name: "categoly1012",
        categoly3_name: "categoly1013",
      })
    );
  }),
  restGet(client.categoly.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          categoly_id: 101,
          categoly1_name: "categoly1011",
          categoly2_name: "categoly1012",
          categoly3_name: "categoly1013",
        },
      ])
    );
  }),
  restGet(client.course, (_req, res, ctx) => {
    return res(
      ctx.json({
        course_id: 101,
        course_name: "course101",
        course_description: "course101 description...",
      })
    );
  }),
  restGet(client.course_level, (_req, res, ctx) => {
    return res(
      ctx.json({
        course_level_id: 101,
        level_name: "course_level101",
        level_description: "course_level101 description...",
      })
    );
  }),
  restGet(client.find, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          badge_name: "degitalbadge101",
          badge_image: "degitalbadge101.jpg",
        },
      ])
    );
  }),
  restGet(client.find.course, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          badge_name: "degitalbadge101",
          badge_image: "degitalbadge101.jpg",
        },
      ])
    );
  }),
  restGet(client.find.level, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          badge_name: "degitalbadge101",
          badge_image: "degitalbadge101.jpg",
        },
      ])
    );
  }),
  restGet(client.find.badges, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          badge_name: "degitalbadge101",
          badge_image: "degitalbadge101.jpg",
        },
      ])
    );
  }),
  restGet(client.badges, (_req, res, ctx) => {
    return res(
      ctx.json({
        badge_id: 101,
        badge_name: "degitalbadge101",
        badge_image: "degitalbadge101.jpg",
      })
    );
  }),
  restGet(client.badges.list, (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          badge_id: 101,
          badge_name: "degitalbadge101",
          badge_image: "degitalbadge101.jpg",
        },
      ])
    );
  }),
  restGet(client.badges.consumer, (_req, res, ctx) => {
    return res(
      ctx.json({
        consumer_id: 101,
        consumer_name: "consumer101",
        consumer_url: "https://example.com/consumer101/",
        consumer_mailaddr: "consumer101@example.com",
      })
    );
  }),
];
