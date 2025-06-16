import type { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify, importSPKI } from "jose";
import { JWT_DEBUG_VALUE, JWT_VERIFICATION_KEY_BASE64 } from "lib/env";

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
  const cookie = req.cookies.session_cookie ?? JWT_DEBUG_VALUE;
  if (!cookie) return res.status(400).send("400 Bad Request");
  const key = await importSPKI(atob(JWT_VERIFICATION_KEY_BASE64), "RS256");
  const verified = await jwtVerify<UserAttributes>(cookie, key);
  return res.status(200).json(verified.payload);
}
