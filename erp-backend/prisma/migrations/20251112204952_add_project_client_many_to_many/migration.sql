/*
  Warnings:

  - You are about to drop the column `clientId` on the `project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_clientId_fkey";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "clientId";

-- CreateTable
CREATE TABLE "ClientsOnProjects" (
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ClientsOnProjects_pkey" PRIMARY KEY ("projectId","clientId")
);

-- AddForeignKey
ALTER TABLE "ClientsOnProjects" ADD CONSTRAINT "ClientsOnProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnProjects" ADD CONSTRAINT "ClientsOnProjects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
