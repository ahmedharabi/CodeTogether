/*
  Warnings:

  - You are about to drop the column `createdById` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_createdById_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "createdById",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
