/*
  Warnings:

  - You are about to alter the column `quantity` on the `OrderDetail` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `OrderDetail` MODIFY `quantity` INTEGER NOT NULL;
