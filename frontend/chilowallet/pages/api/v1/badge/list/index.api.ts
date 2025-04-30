import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerDebug, loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { getBadgeListFromMoodle } from "@/server/services/badgeList.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { BadgeListReqestParam, BadgeListResponse } from "@/types/api/badge";
import { ErrorResponse } from "@/types/api/error";

const apiPath = api.v1.badge.list;

const querySchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  lmsId: z.number(),
});

async function handler(req: NextApiRequest, res: NextApiResponse<BadgeListResponse | ErrorResponse>) {
  loggerInfo(logStartForApi(apiPath));

  const result = querySchema.safeParse(req.body);
  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.body);

    return res.status(400).json({ error: { errorMessage: errors.response400.message } });
  }

  const { username, password, lmsId } = req.body as BadgeListReqestParam;

  loggerInfo("request body", { username, password: "****", lmsId });

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  if (!eppn) {
    return res.status(401).json({ error: { errorMessage: errors.unAuthrizedError.detail.noSession } });
  }

  try {
    const walletId = await getWalletId(eppn);
    const reqUsername = password ? username : eppn;
    const badgeList = await getBadgeListFromMoodle({ walletId, username: reqUsername, password, lmsId });

    loggerDebug("get badgeList", badgeList);
    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json(badgeList);
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}

export default handler;
