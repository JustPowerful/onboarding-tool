-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "UserInWorkspace" DROP CONSTRAINT "UserInWorkspace_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "UserInWorkspace" ADD CONSTRAINT "UserInWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
