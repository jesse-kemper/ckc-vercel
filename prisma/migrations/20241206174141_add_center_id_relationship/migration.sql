/*
  Warnings:

  - You are about to drop the column `locationId` on the `PetLog` table. All the data in the column will be lost.
  - You are about to drop the column `runnerInitials` on the `PetLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PetLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[centerId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `centerId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centerId` to the `PetLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petReservationId` to the `PetLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PetLog" DROP CONSTRAINT "PetLog_locationId_fkey";

-- DropForeignKey
ALTER TABLE "PetLog" DROP CONSTRAINT "PetLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "address" TEXT,
ADD COLUMN     "centerId" INTEGER NOT NULL,
ADD COLUMN     "cityState" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "zip" TEXT;

-- AlterTable
ALTER TABLE "PetLog" DROP COLUMN "locationId",
DROP COLUMN "runnerInitials",
DROP COLUMN "userId",
ADD COLUMN     "centerId" INTEGER NOT NULL,
ADD COLUMN     "petReservationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_centerId_key" ON "Location"("centerId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_email_key" ON "Location"("email");

-- AddForeignKey
ALTER TABLE "PetLog" ADD CONSTRAINT "PetLog_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Location"("centerId") ON DELETE RESTRICT ON UPDATE CASCADE;
