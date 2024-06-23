import { FastifyReply, FastifyRequest } from "fastify";
import {
  AddMemberInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  GetMembersInput,
  UpdateWorkspaceInput,
  getNotInscribedMembersInput,
} from "./workspace.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const NUMBER_OF_USERS_PER_PAGE = 5;

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

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    if (user?.role === "MANAGER") {
      const workspaces = await request.server.prisma.workspace.findMany();
      return reply.code(200).send({
        message: "Workspaces managed by you are listed successfully",
        workspaces,
      });
    }

    const joinedWorkspaceList =
      await request.server.prisma.userInWorkspace.findMany({
        where: {
          userId: Number(user.id),
        },
        include: {
          workspace: true,
        },
      });

    const workspaces = joinedWorkspaceList.map(
      (joinedWorkspace) => joinedWorkspace.workspace
    );
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

// for member management
export async function addMember(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { workspaceId, userId } = request.body as AddMemberInput;
    await request.server.prisma.userInWorkspace.create({
      data: {
        userId: Number(userId),
        workspaceId: Number(workspaceId),
      },
    });
    return reply.code(201).send({ message: "Member added successfully" });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
export async function removeMember(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { workspaceId, userId } = request.body as AddMemberInput;
    await request.server.prisma.userInWorkspace.deleteMany({
      where: {
        workspaceId: Number(workspaceId),
        userId: Number(userId),
      },
    });
    // we also need to remove the user from all the tasks in the workspace
    // to do that we remove the assignements of the user in the workspace
    await request.server.prisma.assignment.deleteMany({
      where: {
        userId: Number(userId),
        task: {
          checklist: {
            workspaceId: {
              equals: Number(workspaceId),
            },
          },
        },
      },
    });
    return reply.code(200).send({ message: "Member removed successfully" });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
export async function getMembers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { workspaceId, page, search } = request.query as GetMembersInput;
    var searchCondition = {};
    if (search) {
      searchCondition = {
        OR: [
          {
            user: {
              firstname: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              lastname: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
    }
    const members = await request.server.prisma.userInWorkspace.findMany({
      where: {
        workspaceId: Number(workspaceId),
        ...searchCondition,
      },
      include: {
        user: true,
      },
      skip: Number(page) * NUMBER_OF_USERS_PER_PAGE,
      take: NUMBER_OF_USERS_PER_PAGE,
    });
    const totalUsers = await request.server.prisma.userInWorkspace.count({
      where: {
        workspaceId: Number(workspaceId),
        ...searchCondition,
      },
    });
    const totalPages = Math.ceil(totalUsers / 10);
    const users = members.map((member) => member.user);
    return reply.code(200).send({
      message: "Members fetched successfully",
      users,
      totalPages,
      totalUsers,
      rowsPerPage: NUMBER_OF_USERS_PER_PAGE,
    });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
export async function getNotInscribedUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { workspaceId, page, search } =
    request.query as getNotInscribedMembersInput;

  var searchCondition = {};
  if (search) {
    searchCondition = {
      OR: [
        { firstname: { contains: search, mode: "insensitive" } },
        { lastname: { contains: search, mode: "insensitive" } },
      ],
    };
  }
  try {
    const users = await request.server.prisma.user.findMany({
      where: {
        ...searchCondition,
        role: "EMPLOYEE",
        NOT: {
          workspaces: {
            some: {
              workspaceId: Number(workspaceId),
            },
          },
        },
      },
      skip: (Number(page) - 1) * NUMBER_OF_USERS_PER_PAGE,
      take: NUMBER_OF_USERS_PER_PAGE,
    });
    const totalUsers = await request.server.prisma.user.count({
      where: {
        ...searchCondition,
        role: "EMPLOYEE",
        NOT: {
          workspaces: {
            some: {
              workspaceId: Number(workspaceId),
            },
          },
        },
      },
    });
    const totalPages = Math.ceil(totalUsers / 10);
    return reply.code(200).send({
      message: "Users fetched successfully",
      users,
      totalPages,
      totalUsers,
      rowsPerPage: NUMBER_OF_USERS_PER_PAGE,
    });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
