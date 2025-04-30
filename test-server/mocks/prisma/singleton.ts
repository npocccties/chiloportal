import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  ...jest.requireActual("@/lib/prisma"), // mock only default export
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

/**
 * used to unit test services
 */
// NOTE: https://github.com/prisma/prisma/issues/10203#issuecomment-1451897646
export const prismaMock = prisma as unknown as DeepMockProxy<{
  [K in keyof PrismaClient]: Omit<PrismaClient[K], "groupBy">;
}>;
