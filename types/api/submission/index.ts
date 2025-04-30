import { BadgeConsumer } from "@prisma/client";

export type SubmissionEntry = {
  badgeConsumers: BadgeConsumer[];
  vcImage: string;
  badgeVcId: number;
  badgeName: string;
  badgeIssuedon: string;
};

export type SubmissionEmailRequestParam = {
  consumerId: number;
  email: string;
};

export type SubmissionVcRequestParam = {
  consumerId: number;
  badgeVcId: number;
  email: string;
  externalLinkageId: string;
};
export type SendMail = {
  hashConfirmCode: string;
};
