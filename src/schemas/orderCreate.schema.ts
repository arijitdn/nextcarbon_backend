import { z } from "zod";

const orderCreateSchema = z.object({
  amount: z.number({
    message: "Order amount must be a valid number",
  }),
  currency: z
    .string({
      message: "Order currency must be a valid string",
    })
    .optional(),
});

export default orderCreateSchema;
