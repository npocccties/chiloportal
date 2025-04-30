import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { api } from "@/share/api";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/server/services/submission.service");

describe(api.v1.badge.metadata, () => {
  test("emailが不正な値だった場合に400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        consumerId: 1,
        email: "xxxxxxxxxxxx",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("メールサーバーへの送信リクエストが完了し、200が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        consumerId: 1,
        email: "xxxx.yyy@example.com",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(200);
  });
});
