/*
  Warnings:

  - You are about to alter the column `day` on the `dailymenu` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `dailymenu` MODIFY `day` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `menu` ALTER COLUMN `day` DROP DEFAULT;
