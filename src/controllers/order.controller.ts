import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import razorpay from "../lib/razorpay";
import db from "../lib/db";
import orderCreateSchema from "../schemas/orderCreate.schema";
import orderVerifySchema from "../schemas/orderVerify.schema";

class OrderController {
  async getOrderById(req: Request, res: Response) {
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

  async createOrder(req: Request, res: Response) {
    const { success, data, error } = orderCreateSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });

      return;
    }

    const orderReceipt = `rcpt_${Date.now()}`;

    const orderOptions = {
      amount: data.amount.toString(),
      currency: data.currency ?? "INR",
      receipt: orderReceipt,
    };

    try {
      const order = await razorpay.orders.create(orderOptions);

      if (order) {
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

  async verifyOrder(req: Request, res: Response) {
    const { data, success, error } = orderVerifySchema.safeParse(req.body);

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

export default new OrderController();
