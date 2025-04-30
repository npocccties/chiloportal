import { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logStartForApi, logStatus, logEndForApi } from "@/constants/log";
import { loggerInfo, loggerError } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { createWallet } from "@/server/repository/wallet";
import { api } from "@/share/api";
import { ErrorResponse } from "@/types/api/error";

const apiPath = api.v1.entry;

async function handler(req: NextApiRequest, res: NextApiResponse<void | ErrorResponse>) {
  loggerInfo(logStartForApi(apiPath));
  loggerInfo("request session", req.cookies.session_cookie);

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  if (!eppn) {
    return res.status(401).json({ error: { errorMessage: errors.unAuthrizedError.detail.noSession } });
  }

  try {
    await createWallet(eppn);

    loggerInfo(`${logStatus.success} ${apiPath}`);
    return res.status(200).json();
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}

export default handler;
