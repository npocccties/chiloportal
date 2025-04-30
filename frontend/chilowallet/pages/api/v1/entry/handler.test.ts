import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";
import { mockAddWallet } from "@/test-server/mocks/mockData";
import { prismaMock } from "@/test-server/mocks/prisma/singleton";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

describe(api.v1.entry, () => {
  test("セッション情報がないため401で返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      cookies: {
        session_cookie: undefined,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(401);
  });

  test("ウォレットの作成が成功し200が返る", async () => {
    prismaMock.wallet.create.mockResolvedValue(mockAddWallet);

    const mockReq = createRequest<ApiRequest>({
      cookies: {
        session_cookie: loginJwt,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(200);
  });
});
