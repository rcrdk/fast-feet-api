-- DropForeignKey
ALTER TABLE "orders_statuses" DROP CONSTRAINT "orders_statuses_attachment_id_fkey";

-- DropForeignKey
ALTER TABLE "orders_statuses" DROP CONSTRAINT "orders_statuses_order_id_fkey";

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "orders_attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
