import { z } from "zod";

const orderVerifySchema = z.object({
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

export default orderVerifySchema;
