import { api } from "..";

import { axiosClient } from "@/lib/axios";
import { BadgeImportRequestParam } from "@/types/api/badge/index";

export const importBadgeConvertToVc = async (param: BadgeImportRequestParam) => {
  const apiPath = api.v1.badge.convert;
  const { uniquehash, email, badgeMetaData, lmsId, lmsName } = param;

  const res = await axiosClient.post(apiPath, {
    uniquehash,
    email,
    badgeMetaData,
    lmsId,
    lmsName,
  });

  return res;
};
