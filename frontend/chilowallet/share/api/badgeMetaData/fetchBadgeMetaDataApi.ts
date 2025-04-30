import { api } from "..";

import { axiosClient } from "@/lib/axios";
import { BadgeMetaDataReqestParam } from "@/types/api/badge";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

export type BadgeMetaDataApiResponse = {
  data: BadgeMetaData;
};

export const fetchBadgeMetaDataApi = async (params: BadgeMetaDataReqestParam) => {
  const apiPath = api.v1.badge.metadata;
  const { uniquehash, lmsUrl } = params;

  const res = await axiosClient.get<BadgeMetaDataApiResponse>(`${apiPath}?uniquehash=${uniquehash}&lmsUrl=${lmsUrl}`);

  return res.data;
};
