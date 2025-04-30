import { LmsList } from "@prisma/client";

export const lmsListTestData: LmsList[] = [
  {
    lmsId: 1,
    lmsName: "OKUTEP",
    lmsUrl: "https://dev-lms.oku.cccties.org",
    ssoEnabled: false,
    lmsAccessToken: "",
    lmsService: "moodle_mobile_app",
  },
  {
    lmsId: 2,
    lmsName: "○○ラーニング",
    lmsUrl: "https://dev-lms.oku.cccties.org",
    ssoEnabled: true,
    lmsAccessToken: "v721b60a05b20d1083594c14166dd0a9c",
    lmsService: "moodle_mobile_app",
  },
  {
    lmsId: 3,
    lmsName: "BBBラーニング",
    lmsUrl: "https://dev-lms.oku.cccties.org",
    ssoEnabled: true,
    lmsAccessToken: "v721b60a05b20d1083594c14166dd0a9c",
    lmsService: "moodle_mobile_app",
  },
  {
    lmsId: 4,
    lmsName: "CCC学習",
    lmsUrl: "https://dev-lms.oku.cccties.org",
    ssoEnabled: true,
    lmsAccessToken: "v721b60a05b20d1083594c14166dd0a9c",
    lmsService: "moodle_mobile_app",
  },
];
