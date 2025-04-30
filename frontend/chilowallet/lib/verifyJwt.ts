import { jwtVerify } from "jose";
import { importSPKI } from "jose";

import { loggerMWError, loggerMWInfo } from "./logger";

const pubKey = process.env.orthros_login_key_base64;

// MEMO: middleware(edge runtime)で使用することを想定

export const verifyOrthrosJwt = async (session_cookie: string) => {
  const cryptKey = await getCryptKey();

  try {
    const result = await jwtVerify(session_cookie, cryptKey, { algorithms: ["RS256"] });

    loggerMWInfo(`verifyResult------------${JSON.stringify(result)}`);

    return true;
  } catch (e) {
    loggerMWError("error! invalid session_cookie", e);
    return false;
  }
};

const getCryptKey = async () => {
  try {
    const publicKey = atob(pubKey).toString();
    const cryptKey = await importSPKI(publicKey, "RS256");

    return cryptKey;
  } catch (e) {
    console.log("error", e);

    loggerMWError("error! get public key");
  }
};
