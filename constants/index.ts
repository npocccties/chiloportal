export const pagePath = {
  entry: "/entry",
  credential: {
    list: "/",
    detail: "/credential/detail",
  },
  badge: {
    import: "/badge/import",
  },
  submission: {
    enter: "/submission",
    confirm: "/submission/confirm",
  },
  login: {
    error: "/login/error",
  },
} as const;

export const pageName = {
  entry: "バッジウォレット作成",
  credential: {
    list: "マイウォレット",
  },
  badge: {
    import: "バッジインポート",
  },
  submission: "バッジ提出",
} as const;

export const sessionStorageKey = {
  confirmCode: "confirmCode",
  submissionEmail: "submissionEmail",
  externalLinkageId: "externalLinkageId",
  consumer: "consumer",
  badgeVc: "badgeVc",
} as const;

export const submissionResult = {
  success: 0,
  badReqestOther: 100,
  badUserId: 101,
  verifyBadgeNG: 102,
  verifyVcNG: 103,
  serverError: 200,
};
