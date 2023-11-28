import aspida from "@aspida/fetch";
import api from "api/$api";
import { NEXT_PUBLIC_API_BASE_URL } from "lib/env";

export const client = api(
  aspida(fetch, { baseURL: NEXT_PUBLIC_API_BASE_URL, throwHttpErrors: true }),
);
