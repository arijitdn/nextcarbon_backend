import express from "express";
import { config } from "dotenv";
import orderRouter from "./routes/order.routes";

config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Nextcarbon!",
  });
});

// Load Routes
app.use("/api/orders", orderRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
