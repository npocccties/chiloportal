import { msEntraRetryConfig } from "@/configs/retry";
import { logStatus } from "@/constants/log";
import { loggerDebug, loggerError } from "@/lib/logger";
import { retryRequest } from "@/lib/retryRequest";
import issuanceConfig from "@/templates/issuance_request_config.json";

const msal = require("@azure/msal-node");

const did_authority = process.env.did_authority as string;
const clientName = process.env.clientName as string;
const azTenantId = process.env.vcApp_azTenantId as string;

const msalConfig = {
  auth: {
    clientId: process.env.vcApp_client_id as string,
    authority: `https://login.microsoftonline.com/${azTenantId}`,
    knownAuthorities: [`https://login.microsoftonline.com/${azTenantId}`],
    clientSecret: process.env.vcApp_client_secret as string,
  },
};

/**
 * @param manifestId
 * @param badgeClass
 * @param email
 * @param sessionId
 * @param base64ImageWithoutPrefix
 * @returns
 */
export const issueRequest = async (
  manifestId: string,
  badgeClass: any,
  verificationURL: string,
  email: string,
  sessionId: string,
  base64ImageWithoutPrefix: string,
  issuedOn: string,
  expires: string,
) => {
  const msalCca = new msal.ConfidentialClientApplication(msalConfig);
  const msalClientCredentialRequest = {
    scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
    skipCache: false,
  };

  let accessToken = "";
  try {
    const result = await msalCca.acquireTokenByClientCredential(msalClientCredentialRequest);
    if (result) {
      accessToken = result.accessToken;
    }
  } catch (e) {
    loggerError("failed to get access token MS Entra");
    throw e;
  }

  const pin = Math.floor(1000 + Math.random() * 9000);

  issuanceConfig.pin.value = pin.toString();
  issuanceConfig.claims.photo = base64ImageWithoutPrefix;
  issuanceConfig.claims.email = email;
  issuanceConfig.claims.verificationURL = verificationURL;
  issuanceConfig.claims.issued = issuedOn;
  issuanceConfig.claims.expire = expires;

  const openbadgeInfo = JSON.stringify(badgeClass);

  issuanceConfig.claims.openbadge = openbadgeInfo;

  issuanceConfig.registration.clientName = clientName;
  issuanceConfig.authority = did_authority;

  // callback urlの指定
  if (process.env.baseURL === "http://localhost:3000") {
    issuanceConfig.callback.url = "https://example.com/api/issuer/issuance-request-callback"; // localhostだとAPI実行でエラーになるため、ダミー
  } else {
    const callbakURL = `${process.env.baseURL}/api/issuer/issuance-request-callback`;
    issuanceConfig.callback.url = callbakURL;
    loggerDebug("callbackURL", callbakURL);
  }

  // セッションidを入れてコールバック側へ引き継ぐ
  issuanceConfig.callback.state = sessionId;
  issuanceConfig.manifest = manifestId;

  const payload = JSON.stringify(issuanceConfig);

  const fetchOptions = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  loggerDebug("issueReqest fetchOptions", fetchOptions);

  const client_api_request_endpoint =
    "https://verifiedid.did.msidentity.com/v1.0/verifiablecredentials/createIssuanceRequest";
  let url = "";
  try {
    const response = await retryRequest(() => {
      return fetch(client_api_request_endpoint, fetchOptions);
    }, msEntraRetryConfig);
    const resp = await response.json();

    if (resp.error) {
      throw new Error(resp.error);
    }
    url = resp.url;
  } catch (e) {
    loggerError(`${logStatus.error} failed to issue request`);
    throw e;
  }

  return { pin, url, sessionId };
};
