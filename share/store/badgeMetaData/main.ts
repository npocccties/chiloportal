import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { BadgeMetaDataGetters, BadgeMetaDataState, BadgeMetaDataActions } from "./types";

import { fetchBadgeMetaDataApi } from "@/share/api/badgeMetaData/fetchBadgeMetaDataApi";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { BadgeMetaDataReqestParam } from "@/types/api/badge";

const badgeMetaDataState = atom<BadgeMetaDataState>({
  key: RECOIL_ATOMS_KEYS.BADGE_METADATA_STATE,
  default: undefined,
});

const useBadgeMetaData = () => {
  return useRecoilValue(badgeMetaDataState);
};

export const badgeMetadataGetters: BadgeMetaDataGetters = {
  useBadgeMetaData,
};

const useFetchBadgeMetaData = () => {
  const setState = useSetRecoilState(badgeMetaDataState);

  const fetchBadgeMetaData = useCallback(
    async (params: BadgeMetaDataReqestParam) => {
      const { uniquehash, lmsUrl } = params;
      const { data } = await fetchBadgeMetaDataApi({ uniquehash, lmsUrl });

      setState(() => {
        return data;
      });
    },
    [setState],
  );

  return { fetchBadgeMetaData };
};

export const badgeMetaDataActions: BadgeMetaDataActions = {
  useFetchBadgeMetaData,
};
