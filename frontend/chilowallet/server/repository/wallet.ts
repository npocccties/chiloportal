import { loggerError } from "@/lib/logger";
import prisma from "@/lib/prisma";

export const findUserWalletId = async (id: string) => {
  try {
    const { walletId } = await prisma.wallet.findUnique({
      select: {
        walletId: true,
      },
      where: {
        orthrosId: id,
      },
    });

    return walletId;
  } catch (e) {
    loggerError("failed to userWalletId", e.message);
    throw e;
  }
};

export const findWallet = async (id: string) => {
  const createdWallet = await prisma.wallet.findUnique({
    where: {
      orthrosId: id,
    },
  });

  return createdWallet;
};

export const createWallet = async (eppn: string) => {
  await prisma.wallet.create({
    data: {
      orthrosId: eppn,
      createdAt: new Date(),
    },
  });
};
