/*
  Warnings:

  - You are about to drop the column `location` on the `property` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `property` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "property" DROP COLUMN "location",
DROP COLUMN "status",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "PropertyStatus";

-- DropEnum
DROP TYPE "PropertyType";
