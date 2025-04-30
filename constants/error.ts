export const errors = {
  response400: {
    label: "400: Bad Request",
    message: "リクエストエラーが発生しました。",
    detail: {
      body: "bodyの値が不正です。",
      param: "パラメータが不正です。",
    },
  },
  response500: {
    label: "500: Internal Server Error",
    message: "サーバー側の処理中にエラーが発生しました。",
  },
  unexpectedError: {
    label: "Un Expected Error",
    message: "予期せぬエラーが発生しました。管理者へお問い合わせください。",
  },
  unAuthrizedError: {
    label: "Un Authrized Error",
    message: "認証情報が確認できませんでした。ログインし直してください。",
    detail: {
      noSession: "no session error",
    },
  },
  vcImportFailed: "バッジのインポートに失敗しました。",
  validation: {
    email: "eメールアドレスが不正な値です。",
    openBadge: "Open Badgeの検証に失敗しました。",
  },
  moodleErrorCode: {
    invalidLogin: "invalidlogin",
  },
  E10000: "E10000", // LMSからユーザ情報が取得できない
  E10001: "E10001", // LMSからコース一覧が取得できない
  E10002: "E10002", // LMSからバッジ一覧が取得できない
  E10003: "E10003", // LMSにバッジのメタデータがない
  E10004: "E10004", // LMSのバッジクラスIDにデータがない
  E10005: "E10005", // LMSのバッジクラスIDのデータの中のalignment.targetUrlの書式不正
  E10006: "E10006", // LMSのバッジクラスIDのデータの中のalignment.targetUrlの中にあるコースIDに該当するコースがない
  E20000: "E20000", // ウォレットDBにLMS一覧が存在しない
  E20001: "E20001", // ウォレットDBにウォレットが存在しない
  E29999: "E29999", // ウォレットサーバにて予期せぬ例外が発生
} as const;
