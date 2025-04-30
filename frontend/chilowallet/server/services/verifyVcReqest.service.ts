import axios from "axios";
import { Resolver } from "did-resolver";
import { importJWK, jwtVerify } from "jose";
import { getResolver } from "web-did-resolver";

import { msEntraRetryConfig } from "@/configs/retry";
import { loggerDebug, loggerError } from "@/lib/logger";
import { retryRequest } from "@/lib/retryRequest";
import { getRequestUrlFromUrlMessage, getProtectedHeaderFromVCRequest } from "@/lib/utils";

export const verifyVcRequest = async (vcRequestUrl: string) => {
  const requestUrl = getRequestUrlFromUrlMessage(vcRequestUrl);

  loggerDebug("verifyVcRequest requestUrl", requestUrl);

  let vcRequestInJwt = "";
  let vcRequestVerified = "";
  try {
    vcRequestInJwt = await retryRequest(() => {
      return axios.get(requestUrl).then((res) => res.data);
    }, msEntraRetryConfig);
    const header = getProtectedHeaderFromVCRequest(vcRequestInJwt);
    const webResolver = getResolver();
    const resolver = new Resolver(webResolver);
    const diddoc = await resolver.resolve(header.kid);
    const iisPublicKey = diddoc.didDocument.verificationMethod[0].publicKeyJwk;

    const key = await importJWK(iisPublicKey, header.alg);
    await jwtVerify(vcRequestInJwt, key);

    loggerDebug("vcRequestVerified", vcRequestVerified);
  } catch (e) {
    loggerError("failed to verifyVcRequest", e);
    throw new Error("verify error", e);
  }

  return vcRequestInJwt;
};
