-- CreateEnum
CREATE TYPE "CLIENT_STATUS" AS ENUM ('DEVELOPMENT', 'REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientInWorkspace" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "status" "CLIENT_STATUS" NOT NULL DEFAULT 'DEVELOPMENT',

    CONSTRAINT "ClientInWorkspace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientInWorkspace" ADD CONSTRAINT "ClientInWorkspace_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInWorkspace" ADD CONSTRAINT "ClientInWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
