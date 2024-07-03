import { FastifyReply, FastifyRequest } from "fastify";
import {
  addClientToWorkspaceInput,
  createClientInput,
  deleteClientInput,
  paginateClientInput,
  paginateWorkspaceClientsInput,
  updateClientInput,
  updateClientStatusInput,
} from "./client.schema";

export async function createClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, phone } = request.body as createClientInput;
  try {
    const client = await request.server.prisma.client.create({
      data: {
        name,
        email,
        phone,
      },
    });
    reply.code(201).send({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}
export async function updateClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, name, email, phone } = request.body as updateClientInput;
  try {
    const client = await request.server.prisma.client.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone,
      },
    });
    reply.code(200).send({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}
export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as deleteClientInput;
  try {
    const client = await request.server.prisma.client.delete({
      where: {
        id: Number(id),
      },
    });
    reply.code(200).send({
      message: "Client deleted successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}
const CLIENT_PER_PAGE = 5;
export async function paginateClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page, search } = request.query as paginateClientInput;
  try {
    let searchCondition = {};
    if (search) {
      searchCondition = {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    const clients = await request.server.prisma.client.findMany({
      where: {
        ...searchCondition,
      },
      take: CLIENT_PER_PAGE,
      skip: page * CLIENT_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalClients = await request.server.prisma.client.count({
      where: {
        ...searchCondition,
      },
    });
    reply.code(200).send({
      message: "Clients fetched successfully",
      clients,
      totalClients,
      rowsPerPage: CLIENT_PER_PAGE,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}

export async function paginateWorkspaceClients(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page, inscribed, search, workspaceId } =
    request.query as paginateWorkspaceClientsInput;
  let inscribedCondition = {};
  let searchCondition = {};
  // get the inscribed clients in the workspace
  if (inscribed) {
    inscribedCondition = {
      workspaces: {
        some: {
          workspaceId: workspaceId,
        },
      },
    };
  } else {
    inscribedCondition = {
      workspaces: {
        none: {
          workspaceId: workspaceId,
        },
      },
    };
  }

  if (search) {
    searchCondition = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }
  const clients = await request.server.prisma.client.findMany({
    where: {
      workspaces: {
        some: {
          workspaceId: Number(workspaceId),
        },
      },
      ...inscribedCondition,
      ...searchCondition,
    },
    include: {
      workspaces: {
        select: {
          workspace: true,
          status: true,
        },
      },
    },
    take: CLIENT_PER_PAGE,
    skip: page * CLIENT_PER_PAGE,
  });
  const totalClients = await request.server.prisma.client.count({
    where: {
      ...inscribedCondition,
      ...searchCondition,
      workspaces: {
        some: {
          workspaceId: Number(workspaceId),
        },
      },
    },
  });

  reply.code(200).send({
    message: "Clients fetched successfully",
    clients,
    totalClients,
    rowsPerPage: CLIENT_PER_PAGE,
  });
  try {
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}

export async function addClientToWorkspace(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clientId, workspaceId } = request.body as addClientToWorkspaceInput;
  try {
    const client = await request.server.prisma.clientInWorkspace.create({
      data: {
        clientId,
        workspaceId,
      },
    });
    reply.code(201).send({
      message: "Client added to workspace successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}
export async function removeClientFromWorkspace(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clientId, workspaceId } = request.body as addClientToWorkspaceInput;
  try {
    const client = await request.server.prisma.clientInWorkspace.deleteMany({
      where: {
        clientId,
        workspaceId,
      },
    });
    reply.code(200).send({
      message: "Client removed from workspace successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}

export async function updateClientStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { clientId, workspaceId, status } =
    request.body as updateClientStatusInput;
  try {
    const client = await request.server.prisma.clientInWorkspace.updateMany({
      where: {
        clientId: clientId,
        workspaceId: workspaceId,
      },
      data: {
        status: status,
      },
    });
    reply.code(200).send({
      message: "Client status updated successfully",
      client,
    });
  } catch (error) {
    reply.code(500).send({
      message: "Internal server error",
    });
  }
}
