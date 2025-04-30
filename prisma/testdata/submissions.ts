import { faker } from "@faker-js/faker";
import { Submission } from "@prisma/client";

import { dateToJtc } from "./badge_vcs";

export const submissionsTestData: Submission[] = [
  {
    badgeVcId: 101,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 1,
    consumerName: "大阪市",
  },
  {
    badgeVcId: 101,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 2,
    consumerName: "大阪府",
  },
  {
    badgeVcId: 101,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 3,
    consumerName: "堺市",
  },
  {
    badgeVcId: 101,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 4,
    consumerName: "大阪市大学連合",
  },
  {
    badgeVcId: 102,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 1,
    consumerName: "大阪市",
  },
  {
    badgeVcId: 102,
    walletId: 1,
    submitedAt: dateToJtc(faker.date.anytime()),
    submissionEmail: "aaa@example.com",
    consumerId: 3,
    consumerName: "堺市",
  },
];
