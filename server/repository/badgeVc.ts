import { loggerError } from "@/lib/logger";
import prisma, { Prisma } from "@/lib/prisma";

export const createBadgeVc = async (input: Prisma.BadgeVcCreateInput) => {
  try {
    await prisma.badgeVc.create({
      data: input,
    });
  } catch (e) {
    loggerError("failed to saveBadgeVc", e.message);
    throw e;
  }
};

export const deleteBadgeVc = async ({ badgeVcId, walletId }: { badgeVcId: number; walletId: number }) => {
  await prisma.badgeVc.delete({
    where: {
      badgeVcId: badgeVcId,
      walletId: walletId,
    },
  });
};
