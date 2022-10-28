/**
 * クライテリアの種類に対応した画像のパスを返す関数
 * @params クライテリアの種類
 * @returns 画像のパス
 */
export function getImagePath(type: string): string {
  switch (type) {
    case "ビデオ":
      return "/criteria-video.png";
    case "小テスト":
      return "/criteria-test.png";
    case "アンケート":
    case "レッスン":
    default:
      return "/criteria-survey.png";
  }
}
