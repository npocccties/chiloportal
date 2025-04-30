import { BadgeMetaDataReqestParam } from "@/types/api/badge";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

export type BadgeMetaDataState = BadgeMetaData | undefined;

export type BadgeMetaDataGetters = {
  useBadgeMetaData: () => BadgeMetaDataState;
};

export type BadgeMetaDataActions = {
  useFetchBadgeMetaData: () => {
    fetchBadgeMetaData: (param: BadgeMetaDataReqestParam) => Promise<void>;
  };
};
