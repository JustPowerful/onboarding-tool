import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";
import { $ref } from "./proposal.schema";
import {
  createProposal,
  deleteProposal,
  getProposalById,
  paginateProposal,
  updateProposal,
} from "./proposal.controller";

async function proposalRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
      schema: {
        body: $ref("createProposalSchema"),
      },
    },
    createProposal
  );

  server.patch(
    "/update",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
      schema: {
        body: $ref("updateProposalSchema"),
      },
    },
    updateProposal
  );
  server.delete(
    "/delete/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER"])],
      schema: {
        params: $ref("deleteProposalSchema"),
      },
    },
    deleteProposal
  );
  server.get(
    "/paginate",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
      schema: {
        querystring: $ref("paginateProposalSchema"),
      },
    },
    paginateProposal
  );
  server.get(
    "/getbyid/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
      schema: {
        params: $ref("getProposalByIdSchema"),
      },
    },
    getProposalById
  );
}

export default proposalRoute;
