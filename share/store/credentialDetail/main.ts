import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { postDeleteCredential } from "@/share/api/credentialDetail/postDeleteCredential";
import { VcDetailActions, VcDetailGetters } from "@/share/store/credentialDetail/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { VcDetailData } from "@/types/api/credential/detail";

const defaultValue: VcDetailData | {} = {
  vcDetaildata: {},
};

const vcDetailState = atom<VcDetailData | {}>({
  key: RECOIL_ATOMS_KEYS.CREDENTIAL_DETAIL_STATE,
  default: defaultValue,
});

const useVcDetail = () => {
  return useRecoilValue(vcDetailState);
};

export const vcDetailGetters: VcDetailGetters = {
  useVcDetail,
};

/**  credentialDetail の fetch */
const useSetVcDetail = () => {
  const setState = useSetRecoilState(vcDetailState);

  const setVcDetail = useCallback(
    async (vcDetailData: VcDetailData) => {
      setState(() => {
        if (!vcDetailData) {
          return defaultValue;
        }
        return vcDetailData;
      });
    },
    [setState],
  );

  return { setVcDetail };
};

/**  credential の delete */
const useDeleteCredential = () => {
  const setState = useSetRecoilState(vcDetailState);

  const deleteCredential = useCallback(
    async (badgeVcId: number) => {
      postDeleteCredential(badgeVcId);
      setState(defaultValue);
    },
    [setState],
  );

  return { deleteCredential };
};

export const vcDetailActions: VcDetailActions = {
  useSetVcDetail,
  useDeleteCredential,
};
