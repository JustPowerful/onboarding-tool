import { FastifyInstance } from "fastify";
import { createTask, deleteTask, updateTask } from "./task.controller";
import { $ref } from "./task.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { managerMiddleware } from "../../middlewares/manager.middleware";

async function taskRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createTaskSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    createTask
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateTaskSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    updateTask
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteTaskSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    deleteTask
  );
}

export default taskRoute;
