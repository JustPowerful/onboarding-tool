import { FastifyInstance } from "fastify";
import {
  createWorkspaceHandler,
  deleteWorkspaceHandler,
  getWorkspacesHandler,
  updateWorkspaceHandler,
} from "./workspace.controller";
import { $ref } from "./workspace.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { managerMiddleware } from "../../middlewares/manager.middleware";

async function workspaceRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createWorkspaceSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    createWorkspaceHandler
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteWorkspaceSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    deleteWorkspaceHandler
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateWorkspaceSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    updateWorkspaceHandler
  );

  server.get(
    "/getall",
    {
      preHandler: [authMiddleware],
    },
    getWorkspacesHandler
  );
}

export default workspaceRoute;
