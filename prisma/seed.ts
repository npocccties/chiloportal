import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { badgeConsumerTestData } from "./testdata/badge_consumers";
import { badgeVcsTestData } from "./testdata/badge_vcs";
import { lmsListTestData } from "./testdata/lms_list";
import { submissionsTestData } from "./testdata/submissions";

const prisma = new PrismaClient();

async function main() {
  // テストデータの挿入;
  for (let i = 0; i < 10; i++) {
    await prisma.wallet.create({
      data: {
        walletId: i,
        orthrosId: faker.string.uuid(),
        createdAt: faker.date.anytime(),
      },
    });
  }
  await prisma.badgeVc.createMany({
    data: badgeVcsTestData,
  });
  await prisma.badgeConsumer.createMany({
    data: badgeConsumerTestData,
  });
  await prisma.submission.createMany({
    data: submissionsTestData,
  });
  await prisma.lmsList.createMany({
    data: lmsListTestData,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
