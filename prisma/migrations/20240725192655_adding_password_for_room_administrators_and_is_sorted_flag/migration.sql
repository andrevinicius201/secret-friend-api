/*
  Warnings:

  - Added the required column `admin_password` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "admin_password" TEXT NOT NULL,
ADD COLUMN     "drawed" BOOLEAN NOT NULL DEFAULT false;
