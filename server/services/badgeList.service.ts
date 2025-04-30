import { myBadgesList } from "./lmsAccess.service";

import { errors } from "@/constants/error";
import { loggerError } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { BadgeListResponse } from "@/types/api/badge";
import { IfBadgeInfo } from "@/types/BadgeInfo";

type Arg = {
  walletId: number;
  username: string;
  password: string;
  lmsId: number;
};

export const getBadgeListFromMoodle = async ({
  walletId,
  username,
  password,
  lmsId,
}: Arg): Promise<BadgeListResponse> => {
  const [badgeVcs, selectLms] = await Promise.all([
    prisma.badgeVc.findMany({
      select: {
        badgeUniquehash: true,
      },
      where: {
        walletId: walletId,
      },
    }),
    prisma.lmsList.findUnique({
      where: {
        lmsId: lmsId,
      },
    }),
  ]);

  try {
    const badgeList: IfBadgeInfo[] = await myBadgesList(username, password, selectLms);

    badgeList.map((badge) => {
      if (badgeVcs.some((x) => x.badgeUniquehash === badge.uniquehash)) {
        badge.vcConverted = true;
        return;
      }
      badge.vcConverted = false;
    });

    return { badgeList };
  } catch (e) {
    if (e.message === errors.moodleErrorCode.invalidLogin) {
      return { badgeList: [], loginError: e.message };
    }

    loggerError("ERROR! server/services/badgeList.service", e.message);
    throw e;
  }
};

export const getVcBadge = async (
  badgeClassId: string,
  walletId: number,
  lmsId: number,
) => {
  const [badgeVcs] = await Promise.all([
    prisma.badgeVc.findFirst({
      select: {
        badgeVcId: true,
        badgeExpires: true,
        createdAt: true,
        badgeIssuerName: true,
        badgeName: true,
      },
      where: {
        badgeClassId: badgeClassId,
        walletId: walletId,
        lmsId: lmsId,
      },
    }),
  ]);
  if (!badgeVcs) {
    return undefined;
  }
  return badgeVcs;
};

export const getVcBadges = async (
  walletId: number,
  lmsId: number,
) => {
  const [badgeVcs] = await Promise.all([
    prisma.badgeVc.findMany({
      select: {
        badgeVcId: true,
        badgeExpires: true,
        createdAt: true,
        badgeClassId: true,
        badgeIssuedon: true,
        badgeUniquehash: true,
        badgeName: true,
        badgeIssuerName: true,
      },
      where: {
        walletId: walletId,
        lmsId: lmsId,
      },
    }),
  ]);
  if (!badgeVcs) {
    return undefined;
  }
  return badgeVcs;
};
