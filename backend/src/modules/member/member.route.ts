import { FastifyInstance } from "fastify";
import { getAllMembers } from "./member.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { $ref } from "./member.schema";

async function memberRoute(server: FastifyInstance) {
  // GET /api/member/getall?search={string}&page={number}
  server.get(
    "/getall",
    {
      preHandler: [authMiddleware],
      schema: {
        querystring: $ref("getAllMembersSchema"),
      },
    },
    getAllMembers
  );
}

export default memberRoute;
