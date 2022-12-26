import aspida, { HTTPError } from "@aspida/fetch";
import api from "api/$api";
import { NEXT_PUBLIC_API_BASE_URL } from "lib/env";

export const client = api(
  aspida(fetch, { baseURL: NEXT_PUBLIC_API_BASE_URL, throwHttpErrors: true })
);

export async function getErrorProps(
  e: unknown
): Promise<{ title: string; statusCode: number }> {
  if (e instanceof HTTPError) {
    if (e.response.headers.get("content-type")?.includes("application/json")) {
      const { detail } = (await e.response.json()) as { detail: string };
      return {
        title: detail,
        statusCode: e.response.status,
      };
    }
    return {
      title: e.message,
      statusCode: e.response.status,
    };
  }
  if (e instanceof Error) {
    return {
      title: e.message,
      statusCode: 500,
    };
  }
  return {
    title: "Unknown error occured",
    statusCode: 500,
  };
}
