import { BadgeVc } from "@prisma/client";

import { credentials } from "../repository/credentials";
import { CredentialsRequest as CredentialsRequest } from "../types";

import { convertUTCtoJSTstr } from "@/lib/date";
import { BadgeVcList, CredentialList, DisplayBadgeVc, SubmissionsAll } from "@/types/api/credential";

export const getCredentialList = async ({ searchState, walletId }: CredentialsRequest): Promise<CredentialList> => {
  const { badgeVcs, submissions, consumers, submissionCount, badgeCount } = await credentials({
    searchState,
    walletId,
  });

  const badgeVcList: BadgeVcList = badgeVcs.map((badgeVc: BadgeVc): DisplayBadgeVc => {
    const vc: DisplayBadgeVc = {
      badgeVcId: badgeVc.badgeVcId,
      badgeName: badgeVc.badgeName,
      badgeIssuerName: badgeVc.badgeIssuerName,
      badgeIssuedon: convertUTCtoJSTstr(badgeVc.badgeIssuedon),
      badgeExpires: convertUTCtoJSTstr(badgeVc.badgeExpires),
      lmsName: badgeVc.lmsName,
      vcDataPayload: badgeVc.vcDataPayload,
      submissions: [],
    };

    const submission = submissions.filter((s) => s.badgeVcId === badgeVc.badgeVcId);
    submission.forEach((sub) => {
      vc.submissions.push({
        consumerName: sub.consumerName,
        submitedAt: convertUTCtoJSTstr(sub.submitedAt),
      });
    });

    return vc;
  });

  const submissionsAll: SubmissionsAll = {
    totalSubmissionBadges: submissionCount,
    detailSubmissions: [],
  };

  const submitList = submissions.filter((x) => x.walletId === walletId);
  consumers.forEach((consumer) => {
    if (!submitList.some((x) => x.consumerId === consumer.consumerId)) return;

    submissionsAll.detailSubmissions.push({
      cabinetToSubmit: consumer.consumerName,
      submitCount: submissions.filter((item) => item.consumerId === consumer.consumerId).length,
    });
  });

  return { badgeVcList, submissionsAll, totalBadgeCount: badgeCount };
};
