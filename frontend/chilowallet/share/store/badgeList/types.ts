import { BadgeListReqestParam, BadgeListResponse } from "@/types/api/badge";

export type BadgeListState = BadgeListResponse;

export type BadgeListGetters = {
  useBadgeList: () => BadgeListState;
};

export type BadgeListActions = {
  useFetchBadgeList: () => {
    fetchBadgeList: (param: BadgeListReqestParam) => Promise<void>;
  };
  useClearBadgeList: () => {
    clearBadgeList: () => void;
  };
};
