-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'IN_REVIEW';

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';
