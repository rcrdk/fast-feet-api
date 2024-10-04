/*
  Warnings:

  - You are about to drop the column `order_status_id` on the `orders_attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders_attachments" DROP CONSTRAINT "orders_attachments_order_status_id_fkey";

-- AlterTable
ALTER TABLE "orders_attachments" DROP COLUMN "order_status_id";

-- AlterTable
ALTER TABLE "orders_statuses" ADD COLUMN     "attachment_id" TEXT;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "orders_attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
