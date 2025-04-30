/*
  Warnings:

  - You are about to drop the column `badge_owner_email` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the column `mywallet_id` on the `badge_vcs` table. All the data in the column will be lost.
  - The primary key for the `lms_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lmsUrl` on the `lms_list` table. All the data in the column will be lost.
  - You are about to drop the column `lms_list` on the `lms_list` table. All the data in the column will be lost.
  - You are about to drop the column `ssoEnable` on the `lms_list` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `mywallet_id` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the `badge_customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mywallets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `badge_earner_email` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badge_uniquehash` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lms_access_token` to the `lms_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lms_service` to the `lms_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lms_url` to the `lms_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sso_enabled` to the `lms_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_id` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumer_name` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "badge_vcs" DROP CONSTRAINT "badge_vcs_mywallet_id_fkey";

-- DropIndex
DROP INDEX "badge_vcs_mywallet_id_idx";

-- DropIndex
DROP INDEX "submissions_mywallet_id_idx";

-- AlterTable
ALTER TABLE "badge_vcs" DROP COLUMN "badge_owner_email",
DROP COLUMN "mywallet_id",
ADD COLUMN     "badge_earner_email" TEXT NOT NULL,
ADD COLUMN     "badge_uniquehash" TEXT NOT NULL,
ADD COLUMN     "wallet_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lms_list" DROP CONSTRAINT "lms_list_pkey",
DROP COLUMN "lmsUrl",
DROP COLUMN "lms_list",
DROP COLUMN "ssoEnable",
ADD COLUMN     "lms_access_token" TEXT NOT NULL,
ADD COLUMN     "lms_id" SERIAL NOT NULL,
ADD COLUMN     "lms_service" TEXT NOT NULL,
ADD COLUMN     "lms_url" TEXT NOT NULL,
ADD COLUMN     "sso_enabled" BOOLEAN NOT NULL,
ADD CONSTRAINT "lms_list_pkey" PRIMARY KEY ("lms_id");

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "customer_id",
DROP COLUMN "customer_name",
DROP COLUMN "mywallet_id",
ADD COLUMN     "consumer_id" INTEGER NOT NULL,
ADD COLUMN     "consumer_name" VARCHAR(256) NOT NULL,
ADD COLUMN     "wallet_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "badge_customers";

-- DropTable
DROP TABLE "mywallets";

-- CreateTable
CREATE TABLE "badge_consumers" (
    "consumer_id" SERIAL NOT NULL,
    "consumer_name" VARCHAR(256) NOT NULL,
    "cabinet_url" TEXT NOT NULL,

    CONSTRAINT "badge_consumers_pkey" PRIMARY KEY ("consumer_id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "wallet_id" SERIAL NOT NULL,
    "orthros_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_orthros_id_idx" ON "wallets"("orthros_id");

-- CreateIndex
CREATE INDEX "badge_vcs_wallet_id_idx" ON "badge_vcs"("wallet_id");

-- CreateIndex
CREATE INDEX "submissions_wallet_id_idx" ON "submissions"("wallet_id");

-- AddForeignKey
ALTER TABLE "badge_vcs" ADD CONSTRAINT "badge_vcs_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
