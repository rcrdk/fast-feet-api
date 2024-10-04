-- DropForeignKey
ALTER TABLE "orders_attachments" DROP CONSTRAINT "orders_attachments_order_status_id_fkey";

-- AlterTable
ALTER TABLE "orders_attachments" ALTER COLUMN "order_status_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders_attachments" ADD CONSTRAINT "orders_attachments_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "orders_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
