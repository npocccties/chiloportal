import { findUserWalletId } from "../repository/wallet";

export const getWalletId = async (eppn: string) => {
  const walletId = await findUserWalletId(eppn);
  return walletId;
};
