import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/server/services/wallet.service");
jest.mock("@/server/services/submission.service");

describe(api.v1.badge.metadata, () => {
  test("bodyが空だった場合に400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {},
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("cabinetへのapiリクエストが完了し、レスポンスデータと200が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        consumerId: 1,
        email: "xxx@example.com",
        badgeVcId: 1,
        externalLinkageId: "yyy@example.com",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(200);
  });
});
