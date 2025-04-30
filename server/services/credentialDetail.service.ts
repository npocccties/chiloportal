import { BadgeVc } from "@prisma/client";

import { getWalletId } from "./wallet.service";
import { credentialDetail } from "../repository/credentialDetail";

import { convertUTCtoJSTstr } from "@/lib/date";
import { BadgeVcSubmission } from "@/types/api/credential";
import { KnowledgeBadges, VcDetailData } from "@/types/api/credential/detail";
import { Alignment, WisdomBadgeInfo } from "@/types/BadgeInfo";

export const getCredentialDetail = async ({ badgeVcId, eppn }: { badgeVcId: number; eppn: string }) => {
  const walletId = await getWalletId(eppn);

  const { badgeVc, submissions } = await credentialDetail({ walletId, badgeVcId });

  return { badgeVc, submissions };
};

export const getKnowledgeBadges = async (badgeMetaData: WisdomBadgeInfo) => {
  const knowledgeBadges: KnowledgeBadges = [];
  const alignments: Alignment[] = badgeMetaData.alignments.filter((item) => item.targetUrl.includes("/badges"));
  const courseInfo = badgeMetaData.alignments.find((item) => item.targetUrl.includes("/course"));

  alignments.map((item) => {
    knowledgeBadges.push({ badgeName: item.targetName });
  });

  return { courseInfo, knowledgeBadges };
};

export const createVcDetailData = (
  badgeVc: BadgeVc,
  submissionsHistories: BadgeVcSubmission[],
  courseInfo: Alignment,
) => {
  const vcDetailData: VcDetailData = {
    badgeVcId: badgeVc.badgeVcId,
    badgeName: badgeVc.badgeName,
    badgeEarnerEmail: badgeVc.badgeEarnerEmail,
    badgeIssuerName: badgeVc.badgeIssuerName,
    badgeIssuedon: convertUTCtoJSTstr(badgeVc.badgeIssuedon),
    badgeExpires: convertUTCtoJSTstr(badgeVc.badgeExpires),
    lmsName: badgeVc.lmsName,
    vcDataPayload: badgeVc.vcDataPayload,
    courseUrl: courseInfo.targetUrl,
    submissions: submissionsHistories,
  };

  return vcDetailData;
};
