/*
  Warnings:

  - You are about to drop the column `badge_issuer_selector_id` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the column `badge_issuer_selector_name` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the `badge_issuer_selectors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lms_id` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lms_name` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "badge_vcs" DROP COLUMN "badge_issuer_selector_id",
DROP COLUMN "badge_issuer_selector_name",
ADD COLUMN     "lms_id" INTEGER NOT NULL,
ADD COLUMN     "lms_name" VARCHAR(256) NOT NULL;

-- DropTable
DROP TABLE "badge_issuer_selectors";

-- CreateTable
CREATE TABLE "lms_list" (
    "lms_list" SERIAL NOT NULL,
    "lms_name" VARCHAR(256) NOT NULL,
    "lmsUrl" TEXT NOT NULL,
    "ssoEnable" BOOLEAN NOT NULL,

    CONSTRAINT "lms_list_pkey" PRIMARY KEY ("lms_list")
);
