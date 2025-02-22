import { Router } from "express";
import orderController from "../controllers/orderController";

const orderRouter = Router();

orderRouter.route("/:orderId").get(orderController.getOrder);
orderRouter.route("/create").post(orderController.create);
orderRouter.route("/verify").post(orderController.verify);

export default orderRouter;
