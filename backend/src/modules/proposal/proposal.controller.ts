import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateProposalInput,
  DeleteProposalInput,
  PaginateProposalInput,
  UpdateProposalInput,
} from "./proposal.schema";

export async function createProposal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { taskId, name, description, stack } =
    request.body as CreateProposalInput;
  try {
    const user = await request.server.prisma.user.findUnique({
      where: {
        id: Number(request.user.sub),
      },
    });
    if (!user) {
      return reply.code(404).send({
        message: "User not found",
      });
    }
    const proposal = await request.server.prisma.proposal.create({
      data: {
        name,
        description,
        stack,
        taskId,
        userId: user.id,
      },
    });
    reply.code(201).send({
      message: "Proposal created successfully",
      proposal,
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to create proposal",
    });
  }
}

export async function updateProposal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, name, description, stack, status } =
    request.body as UpdateProposalInput;
  try {
    const proposal = await request.server.prisma.proposal.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        stack,
        status,
      },
    });
    reply.code(200).send({
      message: "Proposal updated successfully",
      proposal,
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to update proposal",
    });
  }
}

export async function deleteProposal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as DeleteProposalInput;
  try {
    await request.server.prisma.proposal.delete({
      where: {
        id: Number(id),
      },
    });
    return reply.code(200).send({
      message: "Proposal deleted successfully",
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to delete proposal",
    });
  }
}
const PROPOSAL_PER_PAGE = 5;

export async function paginateProposal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { taskId, page, status } = request.query as PaginateProposalInput;
  try {
    let statusCondition = {};
    if (status) {
      statusCondition = {
        status: status,
      };
    }
    const proposals = await request.server.prisma.proposal.findMany({
      where: {
        taskId: Number(taskId),
        ...statusCondition,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
      take: PROPOSAL_PER_PAGE,
      skip: page * PROPOSAL_PER_PAGE,
    });
    const count = await request.server.prisma.proposal.count({
      where: {
        taskId: Number(taskId),
        ...statusCondition,
      },
    });
    return reply.code(200).send({
      proposals,
      rowsPerPage: PROPOSAL_PER_PAGE,
      totalProposals: count,
    });
  } catch (error) {}
}

export async function getProposalById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };
  try {
    const proposal = await request.server.prisma.proposal.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!proposal) {
      return reply.code(404).send({
        message: "Proposal not found",
      });
    }
    return reply.code(200).send({
      proposal,
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to fetch proposal",
    });
  }
}
