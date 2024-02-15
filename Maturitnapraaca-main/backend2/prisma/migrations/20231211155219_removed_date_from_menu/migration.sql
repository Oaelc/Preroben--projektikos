/*
  Warnings:

  - You are about to drop the column `day` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `day`,
    DROP COLUMN `picture`;
