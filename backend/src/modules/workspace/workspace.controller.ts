import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  UpdateWorkspaceInput,
} from "./workspace.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function createWorkspaceHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name } = request.body as CreateWorkspaceInput;
  try {
    await request.server.prisma.workspace.create({
      data: {
        name: name,
      },
    });
    return reply.code(201).send({ message: "Workspace created successfully" });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteWorkspaceHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as DeleteWorkspaceInput;
  try {
    // check if the workspace exists

    await request.server.prisma.workspace.delete({
      where: {
        id: Number(id),
      },
    });
    return reply.code(200).send({ message: "Workspace deleted successfully" });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Cannot delete the workspace because its not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function updateWorkspaceHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, name } = request.body as UpdateWorkspaceInput;
  try {
    await request.server.prisma.workspace.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });
    return reply.code(200).send({ message: "Workspace updated successfully" });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Cannot update the workspace because its not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function getWorkspacesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const currentUser = request.user;
    const user = await request.server.prisma.user.findUnique({
      where: {
        id: Number(currentUser.sub),
      },
    });
    if (user?.role === "MANAGER") {
      const workspaces = await request.server.prisma.workspace.findMany();
      return reply.code(200).send({
        message: "Workspaces managed by you are listed successfully",
        workspaces,
      });
    }

    const workspaces = await request.server.prisma.workspace.findMany({
      where: {
        users: {
          some: {
            id: user?.id,
          },
        },
      },
    });
    return reply.code(200).send({
      message: "Your workspaces are listed successfully",
      workspaces,
    });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function getWorkspaceByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  try {
    const workspace = await request.server.prisma.workspace.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!workspace) {
      return reply.code(404).send({ message: "Workspace not found" });
    }
    return reply.code(200).send({
      message: "Workspace fetched successfully",
      workspace,
    });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
