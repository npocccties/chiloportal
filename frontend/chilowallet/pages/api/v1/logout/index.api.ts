import { NextApiRequest, NextApiResponse } from "next";

import { logStartForApi, logStatus, logEndForApi } from "@/constants/log";
import { loggerInfo, loggerError } from "@/lib/logger";
import { api } from "@/share/api";
import { ErrorResponse } from "@/types/api/error";

const apiPath = api.v1.logout;

async function handler(req: NextApiRequest, res: NextApiResponse<void | ErrorResponse>) {
  loggerInfo(logStartForApi(apiPath));

  const cookies = req.headers.cookie;
  loggerInfo("-----cookies-----", cookies);

  try {
    if (cookies) {
      const cookiesArray = cookies.split(";");
      cookiesArray.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        res.setHeader("Set-Cookie", `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
      });
    }
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
