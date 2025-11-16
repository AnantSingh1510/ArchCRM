/*
  Warnings:

  - You are about to drop the column `address` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "client" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "gstNumber",
DROP COLUMN "pinCode",
DROP COLUMN "state",
ADD COLUMN     "anniversaryDate" TIMESTAMP(3),
ADD COLUMN     "bankBranch" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "children" INTEGER,
ADD COLUMN     "communicationPreference" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "mailingAddress" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "officeAddress" JSONB,
ADD COLUMN     "passportNo" TEXT,
ADD COLUMN     "permanentAddress" JSONB,
ADD COLUMN     "presentAddress" JSONB,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "relationName" TEXT,
ADD COLUMN     "title" TEXT;
