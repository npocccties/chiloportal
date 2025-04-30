/*
  Warnings:

  - You are about to drop the `wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "wallets";

-- CreateTable
CREATE TABLE "badge_vcs" (
    "badge_vc_id" SERIAL NOT NULL,
    "mywallet_id" INTEGER NOT NULL,
    "moodle_name" VARCHAR(256),
    "badge_category" VARCHAR(256),
    "badge_name" VARCHAR(256),
    "badge_email" TEXT NOT NULL,
    "badge_class_id" TEXT NOT NULL,
    "badge_issuer_name" VARCHAR(256) NOT NULL,
    "badge_issuedon" TIMESTAMP(6) NOT NULL,
    "vc_data_header" TEXT NOT NULL,
    "vc_data_payload" TEXT NOT NULL,
    "vc_data_signature" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "badge_vcs_pkey" PRIMARY KEY ("badge_vc_id")
);

-- CreateTable
CREATE TABLE "mywallets" (
    "mywallet_id" SERIAL NOT NULL,
    "orthros_id" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mywallets_pkey" PRIMARY KEY ("mywallet_id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "badge_vc_id" INTEGER NOT NULL,
    "mywallet_id" INTEGER NOT NULL,
    "submission_time" TIMESTAMP(6) NOT NULL,
    "submission_email" TEXT NOT NULL,
    "submission_to" VARCHAR(256) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("badge_vc_id","submission_time")
);

-- CreateIndex
CREATE UNIQUE INDEX "mywallets_orthros_id_key" ON "mywallets"("orthros_id");

-- AddForeignKey
ALTER TABLE "badge_vcs" ADD CONSTRAINT "badge_vcs_mywallet_id_fkey" FOREIGN KEY ("mywallet_id") REFERENCES "mywallets"("mywallet_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_badge_vc_id_fkey" FOREIGN KEY ("badge_vc_id") REFERENCES "mywallets"("mywallet_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
