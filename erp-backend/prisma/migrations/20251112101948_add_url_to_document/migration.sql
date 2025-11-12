/*
  Warnings:

  - Added the required column `url` to the `document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document" ADD COLUMN     "url" TEXT NOT NULL;
