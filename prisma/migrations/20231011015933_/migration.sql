/*
  Warnings:

  - You are about to drop the column `badge_category` on the `badge_vcs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "badge_vcs" DROP COLUMN "badge_category",
ADD COLUMN     "badge_name" VARCHAR(256);
