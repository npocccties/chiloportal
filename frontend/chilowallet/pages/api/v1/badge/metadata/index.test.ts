import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { api } from "@/share/api";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/configs/retry", () => ({
  moodleRetryConfig: {
    count: 3,
    time: 1000,
  },
}));

describe(api.v1.badge.metadata, () => {
  test("uniquehashが不正な値のため400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        uniquehash: 8869034,
        lmsUrl: "https://lms-example.com",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("lmsUrlが不正な値のため400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        uniquehash: "tesst9kkstr8turieotp89534",
        lmsUrl: "lms-example.com",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("各種パラメータに合わせたバッジのメタデータを取得し、200が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        uniquehash: "testtesttest",
        lmsUrl: "https://moodletest.org",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(200);
  });

  test("存在しないlmsUrlが渡った場合、500が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        uniquehash: "testtesttest",
        lmsUrl: "https://test.org",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(500);
  });
});
