import { loggerError } from "@/lib/logger";
import prisma from "@/lib/prisma";

export const credentialDetail = async ({ badgeVcId, walletId }: { badgeVcId: number; walletId: number }) => {
  try {
    const [badgeVc, submissions] = await Promise.all([
      prisma.badgeVc.findUnique({
        where: {
          badgeVcId: badgeVcId,
          walletId: walletId,
        },
      }),
      prisma.submission.findMany({
        where: {
          badgeVcId: badgeVcId,
          walletId: walletId,
        },
      }),
    ]);

    return { badgeVc, submissions };
  } catch (e) {
    loggerError("failed to credentitalDetail", e.message);
    throw new Error(e);
  }
};
