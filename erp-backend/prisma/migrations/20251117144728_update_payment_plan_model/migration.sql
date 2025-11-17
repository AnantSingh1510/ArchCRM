/*
  Warnings:

  - You are about to drop the column `details` on the `payment_plan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `payment_plan` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('CONSTRUCTION', 'DOWN_PAYMENT', 'FLEXI', 'TIME', 'EMI');

-- CreateEnum
CREATE TYPE "EmiCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "DiscountCalculate" AS ENUM ('FIX', 'ADD_DISCOUNT');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PERCENT', 'FIX');

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_paymentPlanId_fkey";

-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "paymentPlanId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment_plan" DROP COLUMN "details",
DROP COLUMN "name",
ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountCalculate" "DiscountCalculate",
ADD COLUMN     "discountPerArea" DOUBLE PRECISION,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION,
ADD COLUMN     "emiCycle" "EmiCycle",
ADD COLUMN     "planName" TEXT NOT NULL DEFAULT 'Default Plan',
ADD COLUMN     "planType" "PlanType" NOT NULL DEFAULT 'CONSTRUCTION',
ADD COLUMN     "roi" DOUBLE PRECISION,
ADD COLUMN     "timelyDiscount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'PERCENT';

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
