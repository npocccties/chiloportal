import { Prisma } from "@prisma/client";

import { CredentialsRequest } from "../types";

import prisma from "@/lib/prisma";

export const credentials = async ({ searchState, walletId }: CredentialsRequest) => {
  const [badgeVcs, submissions, consumers, submissionBadgeVcs, badgeCount] = await Promise.all([
    prisma.badgeVc.findMany({
      where: {
        walletId: walletId,
        badgeName: {
          contains: searchState.badgeName,
        },
        badgeIssuedon: {
          gte: searchState.issuedFrom,
          lt: searchState.issuedTo,
        },
      },
      orderBy: {
        badgeIssuedon: searchState.sortOrder === "ask" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
      },
    }),
    prisma.submission.findMany({
      where: {
        walletId: walletId,
      },
    }),
    prisma.badgeConsumer.findMany(),
    prisma.submission.findMany({
      where: {
        walletId: walletId,
      },
      distinct: ["badgeVcId"],
    }),
    prisma.badgeVc.count({
      where: {
        walletId: walletId,
      },
    }),
  ]);

  const submissionCount = submissionBadgeVcs.length;

  return { badgeVcs, submissions, consumers, submissionCount, badgeCount };
};
