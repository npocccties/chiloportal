/*
  Warnings:

  - You are about to drop the column `moodle_name` on the `badge_vcs` table. All the data in the column will be lost.
  - Added the required column `badge_issuer_selector_id` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badge_issuer_selector_name` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Made the column `badge_name` on table `badge_vcs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_name` on table `submissions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_customer_id_fkey";

-- AlterTable
ALTER TABLE "badge_vcs" DROP COLUMN "moodle_name",
ADD COLUMN     "badge_issuer_selector_id" VARCHAR(256) NOT NULL,
ADD COLUMN     "badge_issuer_selector_name" VARCHAR(256) NOT NULL,
ALTER COLUMN "badge_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "customer_name" SET NOT NULL;

-- CreateTable
CREATE TABLE "badge_issuer_selectors" (
    "badge_issuer_selector_id" SERIAL NOT NULL,
    "badge_issuer_selector_name" VARCHAR(256) NOT NULL,
    "badge_issue_url" TEXT NOT NULL,
    "sso_enable" BOOLEAN NOT NULL,

    CONSTRAINT "badge_issuer_selectors_pkey" PRIMARY KEY ("badge_issuer_selector_id")
);
