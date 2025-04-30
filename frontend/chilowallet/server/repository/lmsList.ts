import prisma from "@/lib/prisma";

export const findAllLmsList = async () => {
  return await prisma.lmsList.findMany({
    orderBy: {
      lmsId: "asc",
    },
  });
};

export const findAllSafeLmsList = async () => {
  return await prisma.lmsList.findMany({
    select: {
      lmsId: true,
      lmsName: true,
      lmsUrl: true,
      ssoEnabled: true,
    },
    orderBy: {
      lmsId: "asc",
    },
  });
};
