import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import { orderCreateSchema, orderVerifySchema } from "../lib/zodSchemas";
import OrderOptions from "../types/orderOptions";
import razorpay from "../lib/razorpay";
import db from "../lib/db";

class orderController {
  async getOrder(req: Request, res: Response) {
    const orderId = req.params.orderId;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid order id",
      });

      return;
    }

    const orderDetails = await db.order.findFirst({
      where: {
        orderId,
      },
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = orderCreateSchema.safeParse(req.body());
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });

      return;
    }

    const orderReceipt = `receipt_${uuid()}_${Date.now()}`;

    const orderOptions: OrderOptions = {
      amount: data.amount.toString(),
      currency: data.currency ?? "INR",
      receipt: orderReceipt,
    };

    try {
      const order = await razorpay.orders.create(orderOptions);

      if (order) {
        await db.order.create({
          data: {
            amount: data.amount.toString(),
            currency: data.currency ?? "INR",
            orderId: (order as any).orderId,
            orderStatus: (order as any).status,
            receipt: orderReceipt,
          },
        });

        res.status(200).json({
          success: true,
          message: "Order created successfully",
          data: order,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to create the order",
        });

        return;
      }
    } catch (error) {
      console.log("Failed to create order:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async verify(req: Request, res: Response) {
    const { data, success, error } = orderVerifySchema.safeParse(req.body());

    if (!success) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });

      return;
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
      .update(data.orderId + "|" + data.paymentId)
      .digest("hex");

    if (data.razorpaySignature === expectedSignature) {
      res.status(200).json({
        success: true,
        message: "Payment successfully verified",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment is not verified",
      });
    }
  }
}

export default new orderController();
