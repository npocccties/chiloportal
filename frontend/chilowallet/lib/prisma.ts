import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// NOTE: https://github.com/prisma/prisma/issues/1983#issuecomment-620621213
// NOTE: ホットリロード時にPrismaが新しいインスタンスを作成しないようにする。
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query", "error", "info", "warn"],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "info", "warn"],
    });
  }
  prisma = global.prisma;
}

export default prisma;

export * from "@prisma/client";
