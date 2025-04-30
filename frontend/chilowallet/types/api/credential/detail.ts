import { BadgeVcSubmission, DisplayBadgeVc } from "@/types/api/credential";

export type CredentialDetailData = {
  vcDetailData: VcDetailData;
  knowledgeBadges: KnowledgeBadges;
  submissionsHistories: SubmissionsHistories;
  badgeExportData: string;
};

export type VcDetailData = DisplayBadgeVc & {
  badgeEarnerEmail: string;
  badgeExpires: string;
  courseUrl: string;
  submissions: BadgeVcSubmission[];
};

export type KnowledgeBadges = KnowledgeBadge[];

export type KnowledgeBadge = {
  badgeName: string;
};

export type SubmissionsHistories = SubmissionsHistory[];

export type SubmissionsHistory = {
  consumerName: string;
  submitedAt: string;
};
