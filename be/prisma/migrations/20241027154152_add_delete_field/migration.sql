/*
  Warnings:

  - The values [SHIPPED,DELIVERED,CANCELED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('NEW', 'PENDING', 'CONFIRMED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false;
