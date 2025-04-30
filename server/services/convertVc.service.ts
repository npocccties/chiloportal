import { issue } from "./issue.service";
import { issueRequest } from "./issueRequest.service";
import { getManifest } from "./manifest.service";
import { setOpenBadgeMetadataToImage, getBadgeClassById } from "./openBadge.service";
import { registerBadgeVc } from "./registerBadgeVc.service";
import { verifyVcRequest } from "./verifyVcReqest.service";
import { getWalletId } from "./wallet.service";

import { logStartForApi, logEndForApi } from "@/constants/log";
import { loggerDebug, loggerInfo } from "@/lib/logger";
import { getRequestFromVCRequest, calcPinhash } from "@/lib/utils";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

type Arg = {
  apiPath: string;
  badgeMetaData: BadgeMetaData;
  email: string;
  eppn: string;
  lmsId: number;
  lmsName: string;
  uniquehash: string;
};

export const convertVcFromBadge = async ({ apiPath, badgeMetaData, email, eppn, lmsId, lmsName, uniquehash }: Arg) => {
  const { image } = badgeMetaData.badge;
  // image : "data:image/png;base64,iVBORw0KGg..."; // base64エンコードされた画像データ
  const base64ImageWithoutPrefix = image.split(",")[1];

  const openBadgeImage = await setOpenBadgeMetadataToImage(base64ImageWithoutPrefix, badgeMetaData);

  var manifestURL = process.env.vc_manifest_url;
  const badgeClass = await getBadgeClassById(badgeMetaData.badge.id);
  const verificationURL = badgeMetaData.verify.url;
  var credentialIssuer = process.env.vc_credential_issuer;

  loggerInfo(logStartForApi(apiPath, "issue request"));
  const { pin, url } = await issueRequest(
    manifestURL,
    badgeClass,
    verificationURL,
    email,
    eppn,
    openBadgeImage,
    badgeMetaData.issuedOn?.toString(),
    badgeMetaData.expires?.toString(),
  );
  loggerInfo(logEndForApi(apiPath, "issue request"));

  loggerInfo(logStartForApi(apiPath, "verify issue request"));
  const vcRequestInJwt = await verifyVcRequest(url);

  const { vcRequest } = getRequestFromVCRequest(vcRequestInJwt);

  if (!credentialIssuer) {
    loggerDebug("vc_credential_issuer is not defined.");
    const manifest = await getManifest(manifestURL);
    credentialIssuer = manifest.input.credentialIssuer;
    manifestURL  = manifest.display.contract || manifestURL; // manifest.display.contract = manifestURL と思うが念のため
    loggerDebug(`credentialIssuer: ${credentialIssuer} manifest.display.contract: ${manifest.display.contract}`);
  } else {
    loggerDebug(`vc_credential_issuer: ${credentialIssuer}`);
  }
  const acquiredAttestation = {};

  if (vcRequest.id_token_hint) {
    acquiredAttestation["idTokens"] = { "https://self-issued.me": vcRequest.id_token_hint };
  }
  loggerInfo(logEndForApi(apiPath, "verify issue request"));

  loggerInfo(logStartForApi(apiPath, "issue"));
  const pinhash = await calcPinhash(pin.toString(), vcRequest.pin.salt);

  const vcJwt = await issue(vcRequest, manifestURL, credentialIssuer, acquiredAttestation, { pin: pinhash });
  loggerInfo(logEndForApi(apiPath, "issue"));

  const walletId = await getWalletId(eppn);
  await registerBadgeVc({ walletId, lmsId, lmsName, uniquehash, badgeMetaData, email, vcJwt });
};
