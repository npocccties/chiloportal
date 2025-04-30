/*
  Warnings:

  - You are about to drop the column `badge_email` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the column `badge_name` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the column `create_time` on the `badge_vcs` table. All the data in the column will be lost.
  - You are about to drop the column `create_time` on the `mywallets` table. All the data in the column will be lost.
  - The primary key for the `submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `submission_time` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `submission_to` on the `submissions` table. All the data in the column will be lost.
  - Added the required column `badge_expires` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badge_owner_email` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `badge_vcs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `mywallets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submited_at` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_badge_vc_id_fkey";

-- AlterTable
ALTER TABLE "badge_vcs" DROP COLUMN "badge_email",
DROP COLUMN "badge_name",
DROP COLUMN "create_time",
ADD COLUMN     "badge_expires" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "badge_owner_email" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "mywallets" DROP COLUMN "create_time",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_pkey",
DROP COLUMN "submission_time",
DROP COLUMN "submission_to",
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "customer_name" VARCHAR(256),
ADD COLUMN     "submited_at" TIMESTAMP(6) NOT NULL,
ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("badge_vc_id", "submited_at");

-- CreateTable
CREATE TABLE "badge_customers" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" VARCHAR(256) NOT NULL,
    "cabinet_url" TEXT NOT NULL,

    CONSTRAINT "badge_customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateIndex
CREATE INDEX "badge_vcs_mywallet_id_idx" ON "badge_vcs"("mywallet_id");

-- CreateIndex
CREATE INDEX "submissions_mywallet_id_idx" ON "submissions"("mywallet_id");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_badge_vc_id_fkey" FOREIGN KEY ("badge_vc_id") REFERENCES "badge_vcs"("badge_vc_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "badge_customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "mywallets_orthros_id_key" RENAME TO "mywallets_orthros_id_idx";
