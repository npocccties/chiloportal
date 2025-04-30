import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerDebug, loggerError, loggerInfo } from "@/lib/logger";
import { myOpenBadge } from "@/server/services/lmsAccess.service";
import { api } from "@/share/api";
import { BadgeMetaDataApiResponse } from "@/share/api/badgeMetaData/fetchBadgeMetaDataApi";
import { ErrorResponse } from "@/types/api/error";

const querySchema = z.object({
  uniquehash: z.string(),
  lmsUrl: z.string().url(),
});

const apiPath = api.v1.badge.metadata;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BadgeMetaDataApiResponse | ErrorResponse>,
) {
  loggerInfo(`${logStartForApi(apiPath)}`);
  loggerInfo("request query", req.query);

  const result = querySchema.safeParse(req.query);

  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.query);

    return res.status(400).json({ error: { errorMessage: errors.response400.message } });
  }

  const { uniquehash, lmsUrl } = result.data;

  try {
    const badgeMetaData = await myOpenBadge(uniquehash, lmsUrl);
    loggerDebug("get badgeMetaData", badgeMetaData);
    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json({ data: badgeMetaData });
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(`${logEndForApi(apiPath)}`);
  }
}
