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

export const propertyCreateSchema = z.object({
  name: z.string(),
  status: z.enum(["launchpad", "trading"]),
  price: z.number(),
  availableShares: z.number(),
  location: z.string(),
  type: z.string(),
  image: z.string(),
  attributes: z
    .object({
      sharePerNFT: z.number(),
      propertyType: z.string(),
      initialSharePrice: z.number(),
      initialPropertyValue: z.number(),
    })
    .optional(),
  valueParameters: z.any().array().optional(),
  updates: z.any().array().optional(),
  growth: z.string(),
  description: z.string(),
});
