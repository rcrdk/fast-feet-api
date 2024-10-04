/*
  Warnings:

  - You are about to drop the column `attachment_id` on the `orders_statuses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders_attachments" DROP CONSTRAINT "orders_attachments_order_status_id_fkey";

-- DropForeignKey
ALTER TABLE "orders_statuses" DROP CONSTRAINT "orders_statuses_attachment_id_fkey";

-- AlterTable
ALTER TABLE "orders_statuses" DROP COLUMN "attachment_id";

-- AddForeignKey
ALTER TABLE "orders_attachments" ADD CONSTRAINT "orders_attachments_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "orders_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
