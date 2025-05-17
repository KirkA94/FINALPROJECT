/*
  Warnings:

  - You are about to drop the column `votes` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "votes";

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "optionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
