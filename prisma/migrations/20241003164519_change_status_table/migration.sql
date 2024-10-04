-- DropForeignKey
ALTER TABLE "orders_statuses" DROP CONSTRAINT "orders_statuses_current_location_id_fkey";

-- AlterTable
ALTER TABLE "orders_statuses" ALTER COLUMN "current_location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "distribution_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
