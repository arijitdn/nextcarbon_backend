import { Router } from "express";
import propertyController from "../controllers/propertyController";

const propertyRouter = Router();

propertyRouter
  .route("/")
  .get(propertyController.get)
  .post(propertyController.post)
  .patch()
  .delete();
propertyRouter.route("/:propertyId").get(propertyController.getById);

export default propertyRouter;
