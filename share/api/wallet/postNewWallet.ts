import { api } from "..";

import { axiosClient } from "@/lib/axios";

export const postNewWallet = async () => {
  const apiPath = api.v1.entry;

  await axiosClient.post(apiPath);
};
