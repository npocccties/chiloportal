import type { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify, importSPKI } from "jose";
import { JWT_DEBUG_VALUE, JWT_VERIFICATION_KEY } from "lib/env";

/** ユーザー属性 */
export type UserAttributes = {
  /** eduPersonPrincipalName */
  eppn: string;
  /** 表示名 */
  displayName: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const key = await importSPKI(JWT_VERIFICATION_KEY, "RS256");
  const verified = await jwtVerify<UserAttributes>(
    req.cookies["session_cookie"] ?? JWT_DEBUG_VALUE,
    key,
  );
  res.status(200).json(verified.payload);
}
