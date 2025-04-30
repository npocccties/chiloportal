import crypto from "crypto";

import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import { sendMail } from "@/server/services/submission.service";
import { api } from "@/share/api";
import { ErrorResponse } from "@/types/api/error";
import { SendMail } from "@/types/api/submission";

type SuccessResponse = SendMail;

const apiPath = api.v1.submission.sendmail;

const querySchema = z.object({
  email: z.string().email(),
  consumerId: z.number(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResponse | ErrorResponse>) {
  loggerInfo(`${logStartForApi(apiPath)}`);
  loggerInfo("request body", req.body);

  const result = querySchema.safeParse(req.body);

  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.body);

    return res.status(400).json({ error: { errorMessage: errors.response400.detail.body } });
  }
  const { consumerId, email } = result.data;

  try {
    const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashConfirmCode = crypto.createHash("sha256").update(confirmCode).digest("hex");

    await sendMail(email, confirmCode, consumerId);

    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json({ hashConfirmCode });
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}
