/*
  Warnings:

  - Added the required column `code` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BorrowDateFr` to the `Borrowing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BorrowDateTo` to the `Borrowing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusBorrowId` to the `Borrowing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `publisher` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `borrowing` ADD COLUMN `BorrowDateFr` DATETIME(3) NOT NULL,
    ADD COLUMN `BorrowDateTo` DATETIME(3) NOT NULL,
    ADD COLUMN `statusBorrowId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `BorrowStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Borrowing` ADD CONSTRAINT `Borrowing_statusBorrowId_fkey` FOREIGN KEY (`statusBorrowId`) REFERENCES `BorrowStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
