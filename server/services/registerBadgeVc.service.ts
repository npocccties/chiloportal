import { Prisma } from "@prisma/client";

import { createBadgeVc } from "@/server/repository/badgeVc";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

type Arg = {
  walletId: number;
  lmsId: number;
  lmsName: string;
  uniquehash: string;
  email: string;
  badgeMetaData: BadgeMetaData;
  vcJwt: string;
};

export const registerBadgeVc = async ({ walletId, lmsId, lmsName, uniquehash, badgeMetaData, email, vcJwt }: Arg) => {
  const { vcHeader, vcPayload, vcSignature } = splitJwt(vcJwt);

  const decodeVcPayload = Buffer.from(vcPayload, "base64").toString();
  const decodeVcHeader = Buffer.from(vcHeader, "base64").toString();

  const input: Prisma.BadgeVcCreateInput = {
    wallets: {
      connect: {
        walletId: walletId,
      },
    },
    lmsId: lmsId,
    lmsName: lmsName,
    badgeUniquehash: uniquehash,
    badgeName: badgeMetaData.badge.name,
    badgeEarnerEmail: email,
    badgeClassId: badgeMetaData.badge.id,
    badgeIssuerName: badgeMetaData.badge.issuer.name,
    badgeIssuedon: badgeMetaData.issuedOn,
    badgeExpires: badgeMetaData.expires,
    vcDataHeader: decodeVcHeader,
    vcDataPayload: decodeVcPayload,
    vcDataSignature: vcSignature,
  };

  await createBadgeVc(input);
};

const splitJwt = (jwt: string): { vcHeader: string; vcPayload: string; vcSignature: string } => {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }

  return {
    vcHeader: parts[0],
    vcPayload: parts[1],
    vcSignature: parts[2],
  };
};
