import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { getBadgeListFromMoodle } from "@/server/services/badgeList.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";
import { mockBadgeList } from "@/test-server/mocks/mockData";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/server/services/wallet.service");
jest.mock("@/server/services/badgeList.service");

const mockGetWalletId = getWalletId as jest.MockedFunction<typeof getWalletId>;
const mockGetBadgeListForMoodle = getBadgeListFromMoodle as jest.MockedFunction<typeof getBadgeListFromMoodle>;

describe(api.v1.badge.list, () => {
  test("bodyがundifindであれば400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {},
      cookies: {
        session_cookie: loginJwt,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("eppnがundifindであれば401が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        username: "test",
        lmsId: 1,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(401);
  });

  test("SSO認証時にeppnからバッジリストが返却される", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        lmsId: 1,
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    mockGetWalletId.mockResolvedValue(1);
    mockGetBadgeListForMoodle.mockResolvedValue(mockBadgeList);

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(200);
  });

  test("ユーザー名、パスワード入力時に正常にバッジリストが返却される", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        lmsId: 1,
        username: "test",
        password: "1234",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    mockGetWalletId.mockResolvedValue(1);
    mockGetBadgeListForMoodle.mockResolvedValue(mockBadgeList);

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(200);
  });
});
