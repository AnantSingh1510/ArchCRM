/*
  Warnings:

  - Added the required column `location` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "type" "PropertyType" NOT NULL DEFAULT 'RESIDENTIAL';
