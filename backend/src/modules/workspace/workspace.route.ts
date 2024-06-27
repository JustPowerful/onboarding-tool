import { FastifyInstance } from "fastify";
import {
  addMember,
  createWorkspaceHandler,
  deleteWorkspaceHandler,
  getMembers,
  getNotInscribedUsers,
  getWorkspaceByIdHandler,
  getWorkspacesHandler,
  removeMember,
  updateWorkspaceHandler,
} from "./workspace.controller";
import { $ref } from "./workspace.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";

async function workspaceRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createWorkspaceSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
    },
    createWorkspaceHandler
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteWorkspaceSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
    },
    deleteWorkspaceHandler
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateWorkspaceSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
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

  server.get(
    "/get/:id",
    {
      schema: {
        params: $ref("getWorkspaceSchema"),
      },
      preHandler: [authMiddleware],
    },
    getWorkspaceByIdHandler
  );

  // for member management
  server.post(
    "/addmember",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("addMemberSchema"),
      },
    },
    addMember
  );

  server.delete(
    "/removemember",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("removeMemberSchema"),
      },
    },
    removeMember
  );

  server.get(
    "/getmembers",
    {
      preHandler: [authMiddleware],
      schema: {
        querystring: $ref("getMembersSchema"),
      },
    },
    getMembers
  );

  server.get(
    "/getnotinscribedusers",
    {
      schema: {
        querystring: $ref("getNotInscribedMembersSchema"),
      },
      preHandler: [authMiddleware],
    },
    getNotInscribedUsers
  );
}

export default workspaceRoute;
