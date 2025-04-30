import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { fetchBadgeListApi } from "@/share/api/badgeList/fetchBadgeListApi";
import { BadgeListActions, BadgeListGetters, BadgeListState } from "@/share/store/badgeList/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { BadgeListReqestParam } from "@/types/api/badge";

const defaultState: BadgeListState = { badgeList: [] };

const badgeListState = atom<BadgeListState>({
  key: RECOIL_ATOMS_KEYS.BADGE_LIST_STATE,
  default: defaultState,
});

const useBadgeList = () => {
  return useRecoilValue(badgeListState);
};

export const badgeListGetters: BadgeListGetters = {
  useBadgeList,
};

const useFetchBadgeList = () => {
  const setState = useSetRecoilState(badgeListState);

  const fetchBadgeList = useCallback(
    async (param: BadgeListReqestParam) => {
      const data = await fetchBadgeListApi(param);
      setState(() => {
        if (!data) {
          return defaultState;
        }
        return data;
      });
    },
    [setState],
  );

  return { fetchBadgeList };
};

const useClearBadgeList = () => {
  const setState = useSetRecoilState(badgeListState);

  const clearBadgeList = useCallback(() => {
    setState(() => {
      return defaultState;
    });
  }, [setState]);

  return { clearBadgeList };
};

export const badgeListActions: BadgeListActions = {
  useFetchBadgeList,
  useClearBadgeList,
};
