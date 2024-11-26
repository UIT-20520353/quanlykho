/*
  Warnings:

  - Added the required column `importId` to the `ImportDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ImportDetail` ADD COLUMN `importId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ImportDetail` ADD CONSTRAINT `ImportDetail_importId_fkey` FOREIGN KEY (`importId`) REFERENCES `Import`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
