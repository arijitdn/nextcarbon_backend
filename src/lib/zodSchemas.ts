import { z } from "zod";

export const orderCreateSchema = z.object({
  amount: z.number({
    message: "Order amount must be a valid number",
  }),
  currency: z
    .string({
      message: "Order currency must be a valid string",
    })
    .optional(),
});

export const orderVerifySchema = z.object({
  orderId: z.string({
    message: "Order id must be a valid string",
  }),
  paymentId: z.string({
    message: "Payment id must be a valid string",
  }),
  razorpaySignature: z.string({
    message: "Razorpay signature must be a valid string",
  }),
});
