-- DropIndex
DROP INDEX `User_id_key` ON `user`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` DOUBLE NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dailymenu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` DECIMAL(10, 2) NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
