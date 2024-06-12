/*
  Warnings:

  - Added the required column `pos` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pos` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "pos" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "pos" INTEGER NOT NULL;
