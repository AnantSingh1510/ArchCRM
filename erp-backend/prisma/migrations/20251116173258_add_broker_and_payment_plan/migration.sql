/*
  Warnings:

  - You are about to drop the column `paymentPlan` on the `booking` table. All the data in the column will be lost.
  - Added the required column `paymentPlanId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'BROKER';

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "paymentPlan",
ADD COLUMN     "paymentPlanId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "payment_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan" ADD CONSTRAINT "payment_plan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
