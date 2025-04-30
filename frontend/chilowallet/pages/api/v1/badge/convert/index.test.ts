import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

import handler from "./index.api";

import { validateOpenBadge } from "@/server/services/openBadge.service";
import { api } from "@/share/api";
import { loginJwt } from "@/test-server/mocks/api/login/cookie";
import { mockBadgeMetaData } from "@/test-server/mocks/mockData";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.mock("@/server/services/convertVc.service");
jest.mock("@/server/services/openBadge.service");

const mockValidateOpenBadge = validateOpenBadge as jest.MockedFunction<typeof validateOpenBadge>;

describe(api.v1.badge.convert, () => {
  test("bodyが空であれば400が返る", async () => {
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
        uniquehash: "wwwwwwyyyyyyyypppppp",
        email: "xxxx@example.com",
        badgeMetaData: mockBadgeMetaData,
        lmsId: 1,
        lmsName: "○○サービス",
      },
    });
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);
    expect(mockRes.statusCode).toEqual(401);
  });

  test("バッジからVCへの変換が完了し、200が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        uniquehash: "wwwwwwyyyyyyyypppppp",
        email: "xxxx@example.com",
        badgeMetaData: mockBadgeMetaData,
        lmsId: 1,
        lmsName: "○○サービス",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    mockValidateOpenBadge.mockResolvedValue(true);
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(200);
  });

  test("バッジの検証が失敗すると、400が返る", async () => {
    const mockReq = createRequest<ApiRequest>({
      body: {
        uniquehash: "wwwwwwyyyyyyyypppppp",
        email: "xxxx@example.com",
        badgeMetaData: mockBadgeMetaData,
        lmsId: 1,
        lmsName: "○○サービス",
      },
      cookies: {
        session_cookie: loginJwt,
      },
    });

    mockValidateOpenBadge.mockResolvedValue(false);
    const mockRes = createResponse<ApiResponse>();

    await handler(mockReq, mockRes);

    expect(mockRes.statusCode).toEqual(400);
  });
});
