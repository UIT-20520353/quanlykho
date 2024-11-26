/*
  Warnings:

  - You are about to alter the column `quantity` on the `ImportDetail` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `ImportDetail` MODIFY `quantity` INTEGER NOT NULL;
