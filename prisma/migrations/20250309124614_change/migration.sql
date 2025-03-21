/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photo` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `photo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `country_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Book_code_key` ON `Book`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `User_country_id_key` ON `User`(`country_id`);
