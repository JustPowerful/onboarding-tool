import { FastifyInstance } from "fastify";
import {
  createChecklist,
  deleteChecklist,
  getAllChecklist,
  updateChecklist,
  updateChecklistOrder,
} from "./checklist.controller";
import { $ref } from "./checklist.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";

async function checklistRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createChecklistSchema"),
      },
      preHandler: [
        authMiddleware,
        roleMiddleware(["MANAGER", "EMPLOYEE", "SUPERADMIN"]),
      ],
    },
    createChecklist
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteChecklistSchema"),
      },
      preHandler: [
        authMiddleware,
        roleMiddleware(["MANAGER", "EMPLOYEE", "SUPERADMIN"]),
      ],
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
      preHandler: [
        authMiddleware,
        roleMiddleware(["MANAGER", "EMPLOYEE", "SUPERADMIN"]),
      ],
    },
    updateChecklist
  );
  server.patch(
    "/updateorder",
    {
      preHandler: [
        authMiddleware,
        roleMiddleware(["MANAGER", "EMPLOYEE", "SUPERADMIN"]),
      ],
    },
    updateChecklistOrder
  );
}

export default checklistRoute;
