/*
  Warnings:

  - Added the required column `organizer_nickname` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "organizer_nickname" TEXT NOT NULL;
