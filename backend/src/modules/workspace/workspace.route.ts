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
      preHandler: [authMiddleware, managerMiddleware],
      schema: {
        body: $ref("addMemberSchema"),
      },
    },
    addMember
  );

  server.delete(
    "/removemember",
    {
      preHandler: [authMiddleware, managerMiddleware],
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
