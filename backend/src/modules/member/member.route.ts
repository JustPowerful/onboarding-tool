import { FastifyInstance } from "fastify";
import { deleteMember, getAllMembers } from "./member.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { $ref } from "./member.schema";
import roleMiddleware from "../../middlewares/role.middleware";

async function memberRoute(server: FastifyInstance) {
  // GET /api/member/getall?search={string}&page={number}
  server.get(
    "/getall",
    {
      preHandler: [authMiddleware, roleMiddleware(["SUPERADMIN"])],
      schema: {
        querystring: $ref("getAllMembersSchema"),
      },
    },
    getAllMembers
  );
  server.delete(
    "/delete/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["SUPERADMIN"])],
      schema: {
        params: $ref("deleteMemberSchema"),
      },
    },
    deleteMember
  );
}

export default memberRoute;
