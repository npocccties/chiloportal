import { api } from "..";

import { axiosClient } from "@/lib/axios";

export const postLogoutAction = async () => {
  const apiPath = api.v1.logout;

  await axiosClient.post(apiPath);
};
