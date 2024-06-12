-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_checklistId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
