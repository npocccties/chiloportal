import { z } from "zod";

import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { convertJSTstrToUTCdate, convertJSTstrToUTCdateAddOneDay } from "@/lib/date";
import { loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { dateSchema } from "@/lib/validation";
import { getCredentialList } from "@/server/services/credentialList.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { CredentialList, SearchFormItem } from "@/types/api/credential";
import { ErrorResponse } from "@/types/api/error";

const querySchema = z.object({
  badgeName: z.string().optional(),
  issuedFrom: dateSchema.optional(),
  issuedTo: dateSchema.optional(),
  sortOrder: z.string(),
});

const apiPath = api.v1.credential.list;

async function handler(req: NextApiRequest, res: NextApiResponse<CredentialList | ErrorResponse>) {
  loggerInfo(`${logStartForApi(apiPath)}`);
  loggerInfo("request query", req.query);

  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, req.query);

    return res.status(400).json({ error: { errorMessage: errors.response400.detail.param } });
  }

  const { badgeName, issuedFrom, issuedTo, sortOrder } = result.data;
  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  if (!eppn) {
    return res.status(401).json({ error: { errorMessage: errors.unAuthrizedError.detail.noSession } });
  }

  try {
    const walletId = await getWalletId(eppn);
    const searchState: SearchFormItem = {
      badgeName: badgeName,
      issuedFrom: issuedFrom === "" || !issuedFrom ? undefined : convertJSTstrToUTCdate(issuedFrom.toString()),
      issuedTo: issuedTo === "" || !issuedTo ? undefined : convertJSTstrToUTCdateAddOneDay(issuedTo.toString()),
      sortOrder: sortOrder,
    };

    const { badgeVcList, submissionsAll, totalBadgeCount } = await getCredentialList({ searchState, walletId });
    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json({ badgeVcList, submissionsAll, totalBadgeCount });
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(`${logEndForApi(apiPath)}`);
  }
}

export default handler;
