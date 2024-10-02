-- AlterTable
ALTER TABLE "orders_attachments" ADD COLUMN     "order_status_id" TEXT;

-- AddForeignKey
ALTER TABLE "orders_attachments" ADD CONSTRAINT "orders_attachments_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "orders_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
