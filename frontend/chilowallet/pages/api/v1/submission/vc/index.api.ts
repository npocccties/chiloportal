import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { validateForbiddenCharacters } from "@/lib/validation";
import { sendCabinetForVc } from "@/server/services/submission.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { ErrorResponse } from "@/types/api/error";
import { SubmissionResponseStatus } from "@/types/status";

const apiPath = api.v1.submission.vc;

const querySchema = z.object({
  consumerId: z.number(),
  badgeVcId: z.number(),
  email: z.string().email(),
  externalLinkageId: z.string().refine((v) => validateForbiddenCharacters(v), {
    message: "使用禁止文字が含まれています。",
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ result: SubmissionResponseStatus } | ErrorResponse>,
) {
  loggerInfo(logStartForApi(apiPath));
  loggerInfo("request body", req.body);

  const result = querySchema.safeParse(req.body);

  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.body);

    return res.status(400).json({ error: { errorMessage: errors.response400.detail.body } });
  }

  const { consumerId, email, badgeVcId, externalLinkageId } = result.data;
  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  try {
    const walletId = await getWalletId(eppn);
    const resData = await sendCabinetForVc({ badgeVcId, consumerId, walletId, email, externalLinkageId });
    loggerInfo(`${logStatus.success} ${apiPath}`, resData);

    return res.status(200).json({ result: resData });
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: `api error ${apiPath}`, detail: e.message } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}
