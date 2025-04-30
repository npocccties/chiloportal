import { BadgeConsumer } from "@prisma/client";

export const badgeConsumerTestData: BadgeConsumer[] = [
  {
    consumerId: 1,
    consumerName: "大阪市",
    cabinetUrl: "https://xxx.com",
  },
  {
    consumerId: 2,
    consumerName: "大阪府",
    cabinetUrl: "https://yyy.com",
  },
  {
    consumerId: 3,
    consumerName: "堺市",
    cabinetUrl: "https://zzz.com",
  },
  {
    consumerId: 4,
    consumerName: "大阪市大学連合",
    cabinetUrl: "https://rrr.com",
  },
  {
    consumerId: 5,
    consumerName: "奈良市教育委員会",
    cabinetUrl: "https://nnn.com",
  },
];
