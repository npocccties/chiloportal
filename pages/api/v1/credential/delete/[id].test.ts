import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./[id].api";

import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";
import { prismaMock } from "@/test-server/mocks/prisma/singleton";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/server/services/wallet.service");

const mockGetWalletId = getWalletId as jest.MockedFunction<typeof getWalletId>;

describe(api.v1.credential.delete, () => {
  test("クエリパラメータが空であれば400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {},
      cookies: {
        session_cookie: loginJwt,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("正常に削除が完了し、204が返却される", async () => {
    // @ts-ignore
    prismaMock.badgeVc.delete.mockResolvedValue({});
    const mockReq = createRequest<ApiRequest>({
      query: {
        id: "1",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });
    mockGetWalletId.mockResolvedValue(1);

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(204);
  });
});
