/*
  Warnings:

  - You are about to drop the column `code` on the `book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Book_code_key` ON `book`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `code`;
