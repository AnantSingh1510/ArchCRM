/*
  Warnings:

  - You are about to drop the column `afterDiscountRate` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `agreementDate` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `bookingNo` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `broker` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `builtUpArea` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `carpetArea` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `costCgst` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `costSgst` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `employee` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `globalCost` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `loan` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `mainBroker` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNo` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `netPrice` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `otherCost` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `signedArea` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `tower` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `unitNo` on the `applicant_payment_file` table. All the data in the column will be lost.
  - You are about to drop the column `unitType` on the `applicant_payment_file` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `applicant_payment_file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `applicant_payment_file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applicant_payment_file" DROP COLUMN "afterDiscountRate",
DROP COLUMN "agreementDate",
DROP COLUMN "bank",
DROP COLUMN "bookingNo",
DROP COLUMN "broker",
DROP COLUMN "builtUpArea",
DROP COLUMN "carpetArea",
DROP COLUMN "costCgst",
DROP COLUMN "costSgst",
DROP COLUMN "discount",
DROP COLUMN "email",
DROP COLUMN "employee",
DROP COLUMN "floor",
DROP COLUMN "globalCost",
DROP COLUMN "loan",
DROP COLUMN "mainBroker",
DROP COLUMN "mobileNo",
DROP COLUMN "netPrice",
DROP COLUMN "otherCost",
DROP COLUMN "plan",
DROP COLUMN "rank",
DROP COLUMN "rate",
DROP COLUMN "signedArea",
DROP COLUMN "totalCost",
DROP COLUMN "tower",
DROP COLUMN "unitNo",
DROP COLUMN "unitType",
ADD COLUMN     "bookingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "applicant_payment_file_bookingId_key" ON "applicant_payment_file"("bookingId");

-- AddForeignKey
ALTER TABLE "applicant_payment_file" ADD CONSTRAINT "applicant_payment_file_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
