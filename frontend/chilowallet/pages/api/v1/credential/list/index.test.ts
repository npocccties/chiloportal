import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { getCredentialList } from "@/server/services/credentialList.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";
import { mockBadgeVcList, mockSubmissionsAll } from "@/test-server/mocks/mockData";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

const mockCredentialList = {
  badgeVcList: mockBadgeVcList,
  submissionsAll: mockSubmissionsAll,
  totalBadgeCount: 2,
};

jest.mock("@/server/services/wallet.service");
jest.mock("@/server/services/credentialList.service");

const mockGetWalletId = getWalletId as jest.MockedFunction<typeof getWalletId>;
const mockGetCredentialList = getCredentialList as jest.MockedFunction<typeof getCredentialList>;

describe(api.v1.credential.list, () => {
  test("クエリパラメータがundifindであれば400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      cookies: {
        session_cookie: loginJwt,
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("初回画面表示時のリクエストで正しく200が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        sortOrder: "desk",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    mockGetWalletId.mockResolvedValue(1);
    mockGetCredentialList.mockResolvedValue(mockCredentialList);

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(200);

    const responseData = mockRes._getData();
    const resultData = JSON.stringify(mockCredentialList);
    expect(responseData).toEqual(resultData);
  });

  test("異常な日付がfromに渡った場合に400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        sortOrder: "desk",
        issuedFrom: "999999-01-01",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("異常な日付がtoに渡った場合に400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        sortOrder: "desk",
        issuedTo: "999999-01-01",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(400);
  });

  test("eppnが取得できない場合に401が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      query: {
        sortOrder: "desk",
        issuedTo: "2024-01-01",
      },
    });

    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(401);
  });
});
