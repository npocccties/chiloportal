import { http, HttpResponse } from "msw";
import { client } from "lib/client";
import {
  consumer,
  field,
  portalCategory,
  wisdomBadges,
  knowledgeBadges,
  framework,
  stage,
  consumerGoal,
  consumerBadge,
} from "./faker";

export const handlers = [
  http.get(client.consumer.$path(), () => HttpResponse.json(consumer())),
  http.get(client.consumer.list.$path(), () =>
    HttpResponse.json([...Array(10)].map(consumer))
  ),
  http.get(client.stage.field.list.$path(), () => HttpResponse.json(field())),
  http.get(client.portalCategory.list.$path(), () =>
    HttpResponse.json([...Array(10)].map(portalCategory))
  ),
  http.get(client.portalCategory.badges.list.$path(), ({ request }) => {
    const perPage = 30;
    const url = new URL(request.url);
    const pageNumber = Number(url.searchParams.get("page_number") ?? 1);
    return HttpResponse.json({
      badges: [...Array(30)].map(wisdomBadges),
      total_count: 3000,
      start: perPage * (pageNumber - 1) + 1,
      end: perPage * pageNumber,
    });
  }),
  http.get(client.framework.$path(), () => HttpResponse.json(framework())),
  http.get(client.framework.stage.list.$path(), () =>
    HttpResponse.json([...Array(3)].map(stage))
  ),
  http.get(client.badges.$path(), ({ request }) => {
    const url = new URL(request.url);
    const badgesIds = (url.searchParams.get("badges_ids") ?? "1").split(",");
    switch (url.searchParams.get("badges_type")) {
      case "wisdom":
        return HttpResponse.json(badgesIds.map(wisdomBadges));
      case "knowledge":
        return HttpResponse.json(badgesIds.map(knowledgeBadges));
      default:
        return new HttpResponse(null, { status: 400 });
    }
  }),
  http.get(client.wisdomBadges.list.keyword.$path(), ({ request }) => {
    const perPage = 30;
    const url = new URL(request.url);
    const pageNumber = Number(url.searchParams.get("page_number") ?? 1);
    return HttpResponse.json({
      badges: [...Array(30)].map(wisdomBadges),
      total_count: 3000,
      start: perPage * (pageNumber - 1) + 1,
      end: perPage * pageNumber,
    });
  }),
  http.get(client.wisdomBadges.consumer.list.$path(), () =>
    HttpResponse.json([...Array(10)].map(consumer))
  ),
  http.get(client.consumer.framework.list.$path(), () =>
    HttpResponse.json([...Array(3)].map(framework))
  ),
  http.get(client.consumer.goal.list.$path(), () =>
    HttpResponse.json([...Array(3)].map(consumerGoal))
  ),
  http.get(client.consumer.badges.list.$path(), () =>
    HttpResponse.json([...Array(3)].map(consumerBadge))
  ),
];
