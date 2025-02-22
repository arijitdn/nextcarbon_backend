-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
