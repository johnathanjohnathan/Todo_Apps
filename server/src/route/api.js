import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import taskController from "../controller/task-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// Task API
userRouter.post("/api/tasks", taskController.create);
userRouter.get("/api/tasks", taskController.get);
userRouter.put("/api/tasks/:taskId", taskController.update);
userRouter.delete("/api/tasks/:taskId", taskController.remove);

export { userRouter };
