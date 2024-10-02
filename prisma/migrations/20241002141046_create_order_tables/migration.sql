-- CreateEnum
CREATE TYPE "OrderStatusCode" AS ENUM ('POSTED', 'PICKED', 'TRANSFER_PROCESS', 'AWAITING_PICK_UP', 'TRANSFER_FINISHED', 'ON_ROUTE', 'DELIVERED', 'CANCELED', 'RETURNED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "currentStatusCode" "OrderStatusCode" NOT NULL DEFAULT 'POSTED',
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" TEXT NOT NULL,
    "delivery_person_id" TEXT,
    "receiver_id" TEXT NOT NULL,
    "origin_location_id" TEXT NOT NULL,
    "current_location_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_statuses" (
    "id" TEXT NOT NULL,
    "statusCode" "OrderStatusCode" NOT NULL DEFAULT 'POSTED',
    "details" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "current_location_id" TEXT NOT NULL,
    "attachment_id" TEXT,

    CONSTRAINT "orders_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_attachments" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "orders_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "receivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_origin_location_id_fkey" FOREIGN KEY ("origin_location_id") REFERENCES "distribution_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "distribution_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "distribution_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_statuses" ADD CONSTRAINT "orders_statuses_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "orders_attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
