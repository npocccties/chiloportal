import { CredentialList, SearchFormItem } from "@/types/api/credential";

export type CredentialListState = CredentialList;

export type CredentialListGetters = {
  useCredentialList: () => CredentialListState;
};

export type CredentialListActions = {
  useFetchCredentialList: () => {
    fetchCredentialList: () => Promise<void>;
  };
  useSearchCredentialList: () => {
    searchCredentialList: (param: SearchFormItem) => Promise<void>;
  };
  useSortOrderCredentialList: () => {
    sortOrderCredentialList: (sortOrder: string) => void;
  };
  // useSetBadgeVc: () => {
  //   setBadge: (badge: BadgeVcs) => void;
  // };
};
