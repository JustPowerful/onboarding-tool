import { FastifyInstance } from "fastify";
import { createTask, deleteTask, updateTask } from "./task.controller";
import { $ref } from "./task.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";

async function taskRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    createTask
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    updateTask
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    deleteTask
  );
}

export default taskRoute;
