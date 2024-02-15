-- AlterTable
ALTER TABLE `dailymenu` MODIFY `day` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `menu` ALTER COLUMN `day` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isadmin` BOOLEAN NOT NULL DEFAULT false;
