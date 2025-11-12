-- AlterTable
ALTER TABLE "project" ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "property" ALTER COLUMN "location" DROP DEFAULT;
