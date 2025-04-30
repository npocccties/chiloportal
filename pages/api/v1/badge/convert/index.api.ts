import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { convertVcFromBadge } from "@/server/services/convertVc.service";
import { validateOpenBadge } from "@/server/services/openBadge.service";
import { api } from "@/share/api";
import { BadgeImportRequestParam } from "@/types/api/badge";
import { ErrorResponse } from "@/types/api/error";

type RequestBody = BadgeImportRequestParam;

const apiPath = api.v1.badge.convert;

const querySchema = z.object({
  uniquehash: z.string(),
  email: z.string().email(),
  lmsId: z.number(),
  lmsName: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<void | ErrorResponse>) {
  loggerInfo(`${logStartForApi(apiPath)}`);

  const { uniquehash, email, badgeMetaData, lmsId, lmsName }: RequestBody = req.body;
  loggerInfo("request body", { uniquehash, email, lmsId, lmsName });

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  if (!eppn) {
    return res.status(401).json({ error: { errorMessage: errors.unAuthrizedError.detail.noSession } });
  }

  const result = querySchema.safeParse(req.body);
  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.body);

    return res.status(400).json({ error: { errorMessage: errors.response400.message } });
  }

  try {
    const result = await validateOpenBadge(email, badgeMetaData);
    loggerInfo("openbadge verify result", result);
    if (!result) throw new Error();
  } catch {
    loggerError(`${logStatus.error} open badge verification failed`);

    return res.status(400).json({ error: { errorMessage: errors.validation.openBadge } });
  }

  try {
    await convertVcFromBadge({ apiPath, badgeMetaData, email, eppn, lmsId, lmsName, uniquehash });
    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json();
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: errors.vcImportFailed, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}
