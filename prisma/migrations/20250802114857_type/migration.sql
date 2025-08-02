/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `type` on the `UserSkill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,skillId]` on the table `UserSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."UserSkill_userId_skillId_type_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."UserSkill" DROP COLUMN "type";

-- DropEnum
DROP TYPE "public"."SkillType";

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "public"."UserSkill"("userId", "skillId");
