import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import {
  fetchCredentialListApi,
  fetchSearchCredentialListApi,
} from "@/share/api/credentialList/fetchCredentialListApi";
import { CredentialListActions, CredentialListGetters, CredentialListState } from "@/share/store/credentialList/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { SearchFormItem } from "@/types/api/credential";

const defaultState: CredentialListState = {
  badgeVcList: [],
  submissionsAll: {
    totalSubmissionBadges: 0,
    detailSubmissions: [],
  },
  totalBadgeCount: 0,
};

// state はそのまま export しない
const credentialListState = atom<CredentialListState>({
  key: RECOIL_ATOMS_KEYS.CREDENTIAL_LIST_STATE,
  default: defaultState,
});

// Getter的役割
const useCredentialList = () => {
  return useRecoilValue(credentialListState);
};

export const credentialListGetters: CredentialListGetters = {
  useCredentialList,
};

// Action をカスタムフックとして定義
// credentialList の fetch
const useFetchCredentialList = () => {
  const setState = useSetRecoilState(credentialListState);

  const fetchCredentialList = useCallback(async () => {
    const data = await fetchCredentialListApi();
    setState(() => {
      if (!data) {
        return defaultState;
      }
      return data;
    });
  }, [setState]);

  return { fetchCredentialList };
};

// 検索リクエスト時のAction
const useSearchCredentialList = () => {
  const setState = useSetRecoilState(credentialListState);

  const searchCredentialList = useCallback(
    async (param: SearchFormItem) => {
      const data = await fetchSearchCredentialListApi(param);
      setState(() => {
        if (!data) {
          return defaultState;
        }
        return data;
      });
    },
    [setState],
  );

  return { searchCredentialList };
};

// sort時のAction
const useSortOrderCredentialList = () => {
  const setState = useSetRecoilState(credentialListState);

  const sortOrderCredentialList = useCallback(
    (sortOrder: string) => {
      setState((prev) => {
        const badgeVcList = prev.badgeVcList;
        if (sortOrder === "ask") {
          const askOrderList = [...badgeVcList].sort(
            (x, y) => new Date(x.badgeIssuedon).getTime() - new Date(y.badgeIssuedon).getTime(),
          );
          return {
            ...prev,
            badgeVcList: askOrderList,
          };
        } else if (sortOrder === "desk") {
          const deskOrderList = [...badgeVcList].sort(
            (x, y) => new Date(y.badgeIssuedon).getTime() - new Date(x.badgeIssuedon).getTime(),
          );
          return {
            ...prev,
            badgeVcList: deskOrderList,
          };
        }
        return prev;
      });
    },
    [setState],
  );

  return { sortOrderCredentialList };
};

// /** Badgeを追加 */
// const useSetBadgeVc = () => {
//   const setState = useSetRecoilState(badgeListState);

//   // 引数がある場合は、useCallbackの第一引数へ記述
//   const setBadge = useCallback(
//     (badge: BadgeVcs) => {
//       setState((prev) => {
//         return {
//           badgeList: {
//             badgeVcList: [...prev.badgeList.badgeVcList, badge],
//           },
//         };
//       });
//     },
//     [setState]
//   );

//   return { setBadge };
// };

export const credentialListActions: CredentialListActions = {
  useFetchCredentialList,
  useSearchCredentialList,
  useSortOrderCredentialList,
  // useSetBadgeVc,
};
