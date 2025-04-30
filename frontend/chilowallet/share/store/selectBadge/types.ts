export type SelectBadgeState = {
  email: string;
  uniquehash: string;
  lmsId: number;
  lmsName: string;
};

export type SelectBadgeGetters = {
  useSelectBadgeData: () => SelectBadgeState;
};

export type SelectBadgeActions = {
  useSelectBadge: () => {
    setSelectBadge: (params: SelectBadgeState) => void;
    clearSelectBadge: () => void;
  };
};
