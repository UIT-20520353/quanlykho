-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('NEW', 'PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
