import { FastifyInstance } from "fastify";
import {
  addClientToWorkspace,
  createClient,
  deleteClient,
  paginateClient,
  paginateWorkspaceClients,
  removeClientFromWorkspace,
  updateClient,
  updateClientStatus,
} from "./client.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";
import { $ref } from "./client.schema";

async function clientRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("createClientSchema"),
      },
    },
    createClient
  );
  server.patch(
    "/update",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("updateClientSchema"),
      },
    },
    updateClient
  );
  server.delete(
    "/delete/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        params: $ref("deleteClientSchema"),
      },
    },
    deleteClient
  );

  server.get(
    "/paginate",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        querystring: $ref("paginateClientSchema"),
      },
    },
    paginateClient
  );

  server.get(
    "/paginateworkspaceclients",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        querystring: $ref("paginateWorkspaceClients"),
      },
    },
    paginateWorkspaceClients
  );
  server.post(
    "/addclienttoworkspace",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("addClientToWorkspaceSchema"),
      },
    },
    addClientToWorkspace
  );
  server.delete(
    "/removeclientfromworkspace",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("removeClientFromWorkspaceSchema"),
      },
    },
    removeClientFromWorkspace
  );
  server.patch(
    "/updateclientstatus",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "SUPERADMIN"])],
      schema: {
        body: $ref("updateClientStatusSchema"),
      },
    },
    updateClientStatus
  );
}
export default clientRoute;
