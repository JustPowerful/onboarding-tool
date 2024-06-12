import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  createChecklist,
  deleteChecklist,
  getAllChecklist,
  updateChecklist,
  updateChecklistOrder,
} from "./checklist.controller";
import { $ref } from "./checklist.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { managerMiddleware } from "../../middlewares/manager.middleware";

async function checklistRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createChecklistSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    createChecklist
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteChecklistSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    deleteChecklist
  );
  server.get(
    "/getall/:workspaceId",
    {
      preHandler: [authMiddleware],
    },
    getAllChecklist
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateChecklistSchema"),
      },
      preHandler: [authMiddleware, managerMiddleware],
    },
    updateChecklist
  );
  server.patch(
    "/updateorder",
    {
      preHandler: [authMiddleware, managerMiddleware],
    },
    updateChecklistOrder
  );
}

export default checklistRoute;
