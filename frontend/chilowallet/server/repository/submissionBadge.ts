import prisma from "@/lib/prisma";

export const submissionBadge = async ({ badgeVcId }: { badgeVcId: number }) => {
  const [badgeVc, badgeConsumers] = await Promise.all([
    prisma.badgeVc.findUnique({
      select: {
        badgeVcId: true,
        badgeName: true,
        badgeIssuedon: true,
        vcDataPayload: true,
      },
      where: {
        badgeVcId: badgeVcId,
      },
    }),
    prisma.badgeConsumer.findMany({
      orderBy: {
        consumerId: "asc",
      },
    }),
  ]);

  return { badgeVc, badgeConsumers };
};

export const findConsumerAndBadgeVc = async ({ badgeVcId, consumerId }: { badgeVcId: number; consumerId: number }) => {
  const [consumer, badgeVc] = await Promise.all([
    prisma.badgeConsumer.findUnique({
      select: {
        consumerName: true,
        cabinetUrl: true,
      },
      where: {
        consumerId: consumerId,
      },
    }),
    prisma.badgeVc.findUnique({
      select: {
        badgeExpires: true,
        vcDataHeader: true,
        vcDataPayload: true,
        vcDataSignature: true,
      },
      where: {
        badgeVcId: badgeVcId,
      },
    }),
  ]);

  return { consumer, badgeVc };
};

export const createSubmission = async ({
  badgeVcId,
  walletId,
  email,
  consumerId,
  consumerName,
}: {
  badgeVcId: number;
  walletId: number;
  email: string;
  consumerId: number;
  consumerName: string;
}) => {
  await prisma.submission.create({
    data: {
      badgeVcId: badgeVcId,
      walletId: walletId,
      submitedAt: new Date(),
      submissionEmail: email,
      consumerId: consumerId,
      consumerName: consumerName,
    },
  });
};
