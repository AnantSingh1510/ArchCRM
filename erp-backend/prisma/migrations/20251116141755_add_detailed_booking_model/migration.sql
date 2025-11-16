-- CreateEnum
CREATE TYPE "UnitHolderType" AS ENUM ('INDIVIDUAL', 'MULTIPLE', 'COMPANY');

-- CreateEnum
CREATE TYPE "CustomerClassification" AS ENUM ('BROKER', 'DIRECT');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('NORMAL', 'HOLD');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "unitHolderType" "UnitHolderType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "unitType" "PropertyType" NOT NULL,
    "customerClassification" "CustomerClassification" NOT NULL,
    "brokerId" TEXT,
    "bookingType" "BookingType" NOT NULL,
    "paymentPlan" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "basicPrice" DOUBLE PRECISION NOT NULL,
    "formNo" TEXT,
    "registrationNo" TEXT,
    "gstin" TEXT,
    "companyDiscount" JSONB,
    "brokerDiscount" JSONB,
    "clientId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "salesEmployeeId" TEXT NOT NULL,
    "remarks" TEXT,
    "otherCosts" JSONB,
    "finance" JSONB,
    "nomineeDetails" JSONB,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_salesEmployeeId_fkey" FOREIGN KEY ("salesEmployeeId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
