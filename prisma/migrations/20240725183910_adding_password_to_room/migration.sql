/*
  Warnings:

  - Added the required column `password` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "password" TEXT NOT NULL;
