import axios from "axios";

import { msEntraRetryConfig } from "@/configs/retry";
import { loggerDebug } from "@/lib/logger";
import { retryRequest } from "@/lib/retryRequest";
import { KeyPair, Signer } from "@/lib/signer";
import { AcquiredIdToken, VCRequest } from "@/types";

interface IIssueResponse {
  data: {
    vc: string;
  };
}

export const issue = async (
  vcRequest: VCRequest,
  manifestURL: string,
  credentialIssuer: string,
  acquiredIdToken: AcquiredIdToken,
  options?: { [key: string]: any },
): Promise<string> => {
  const key = process.env.private_key_jwk;
  const keyObj: KeyPair = JSON.parse(key);

  const signer = new Signer();
  await signer.init(keyObj);

  loggerDebug("wallet did", signer.did);
  loggerDebug(`manifestURL: ${manifestURL}`);

  let attestations: any = { ...acquiredIdToken };

  const issueRequestIdToken = await signer.siop({
    aud: credentialIssuer,
    contract: manifestURL,
    attestations,
    pin: options?.pin,
  });

  loggerDebug("issue request id token", issueRequestIdToken);

  const issueResponse = await retryRequest(() => {
    return axios.post<string, IIssueResponse>(credentialIssuer, issueRequestIdToken, {
      headers: { "Content-Type": "text/plain" },
    });
  }, msEntraRetryConfig);

  const vc = issueResponse.data.vc;

  await axios.post(vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id, {
    state: vcRequest.state,
    code: "issuance_successful",
  });

  return vc;
};
