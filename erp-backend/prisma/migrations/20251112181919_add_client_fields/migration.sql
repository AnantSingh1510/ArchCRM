-- AlterTable
ALTER TABLE "client" ADD COLUMN     "aadhaarNumber" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "joinedDate" TIMESTAMP(3),
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "state" TEXT;
