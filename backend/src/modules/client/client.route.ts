import { FastifyInstance } from "fastify";
import {
  createClient,
  deleteClient,
  paginateClient,
  updateClient,
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
    "/delete",
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
}
export default clientRoute;
