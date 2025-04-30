import { MockedRequest, ResponseResolver, restContext } from "msw";

export const url = "https://moodletest.org/badges/assertion.php";
export const notFoundErrorUrl = "https://test.org/badges/assertion.php";

export const mockBadgeMetaData: ResponseResolver<MockedRequest, typeof restContext> = async (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      recipient: {
        identity: "sha256$b7e1fba9f7d18fcadd371525823a684a69f270b0503c616532ff1f4e7137a563",
        type: "email",
        hashed: true,
        salt: "badges1652333434",
      },
      badge: {
        name: "test test 3",
        description: "test badge",
        image: "data:image/png;base64,iVBORw0KGgoA..ZjMD/A8+RlnxJopqmAAAAAElFTkSuQmCC",
        criteria: {
          id: "https://moodletest.org/badges/badgeclass.php?id=32",
          narrative:
            "この条件でバッジ授与\n * このバッジは次のロールのユーザによって授与される必要があります:\nマネージャ\n\n",
        },
        issuer: {
          name: "bbbbbbbb",
          url: "https://moodletest.org",
          email: "bbbbbbbbbb@example.net",
          "@context": "https://w3id.org/openbadges/v2",
          id: "https://moodletest.org/badges/issuer_json.php?id=32",
          type: "Issuer",
        },
        "@context": "https://w3id.org/openbadges/v2",
        id: "https://moodletest.org/badges/badge_json.php?id=32",
        type: "BadgeClass",
        version: "",
        "@language": "ja",
      },
      verify: {
        type: "hosted",
        url: "https://moodletest.org/badges/assertion.php?b=8d6d839383cd6e03624b98b70ce4f475f43c2d04&obversion=2",
      },
      issuedOn: "2023-07-26T10:06:03+09:00",
      evidence: "https://moodletest.org/badges/badge.php?hash=8d6d839383cd6e03624b98b70ce4f475f43c2d04",
      expires: "2024-07-26T00:00:00+09:00",
      "@context": "https://w3id.org/openbadges/v2",
      type: "Assertion",
      id: "https://moodletest.org/badges/assertion.php?b=8d6d839383cd6e03624b98b70ce4f475f43c2d04&obversion=2",
    }),
  );
};

export const mockBadgeMetaDataForError: ResponseResolver<MockedRequest, typeof restContext> = async (req, res, ctx) => {
  return res(ctx.status(404));
};
