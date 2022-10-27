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
