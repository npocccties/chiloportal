import { IfBadgeInfo, IfUserBadgeStatusList } from "@/types/BadgeInfo";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

export type BadgeListReqestParam = {
  lmsId: number;
  username?: string;
  password?: string;
};

export type BadgeListResponse = {
  badgeList: BadgeList;
  loginError?: string;
};

export type BadgeMetaDataReqestParam = {
  lmsUrl: string;
  uniquehash: string;
};

type BadgeList = IfBadgeInfo[];

export type BadgeImportRequestParam = {
  uniquehash: string;
  email: string;
  badgeMetaData: BadgeMetaData;
  lmsId: number;
  lmsName: string;
};

export type BadgeStatusListResponse = {
  user_badgestatuslist: IfUserBadgeStatusList;
};