import { FastifyRequest, FastifyReply } from "fastify";
import {
  AssignMemberInput,
  CreateTaskInput,
  DeleteTaskInput,
  GetAssignementsInput,
  GetTaskByIdInput,
  GetUnassignedMembersInput,
  RemoveAssignementInput,
  UpdateTaskInput,
} from "./task.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const NUMBER_OF_USERS_PER_PAGE = 5;

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const { name, checklistId } = request.body as CreateTaskInput;
  try {
    const tasks = await request.server.prisma.task.findMany({
      where: {
        checklistId: checklistId,
      },
      orderBy: {
        pos: "desc",
      },
    });
    const pos = tasks.length > 0 ? tasks[0].pos + 1 : 0;
    const task = await request.server.prisma.task.create({
      data: {
        name,
        checklistId,
        pos,
      },
    });
    reply.code(201).send({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to create task",
    });
  }
}

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as DeleteTaskInput;

  try {
    await request.server.prisma.task.delete({
      where: {
        id: Number(id),
      },
    });
    return reply.code(200).send({
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Task not found",
        });
      }
    }
    return reply.code(500).send({
      message: "Failed to delete task",
    });
  }
}

export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
  const { id, name, description, dueDate } = request.body as UpdateTaskInput;
  try {
    await request.server.prisma.task.update({
      where: { id: Number(id) },
      data: {
        name: name,
        description: description,
        dueDate: dueDate,
      },
    });
    return reply.code(200).send({
      message: "Task updated successfully",
    });
  } catch (error) {
    return reply.code(500).send({
      message: "Failed to update task",
    });
  }
}

// assignements
export async function assignMember(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId, taskId } = request.body as AssignMemberInput;
  try {
    await request.server.prisma.assignment.create({
      data: {
        userId,
        taskId,
      },
    });
    reply.code(201).send({
      message: "Member assigned successfully",
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // if task or user is not found
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Records not found, please check your input",
        });
      }
    }
  }
}
export async function removeAssignement(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId, taskId } = request.body as RemoveAssignementInput;
  try {
    await request.server.prisma.assignment.deleteMany({
      where: {
        userId: Number(userId),
        taskId: Number(taskId),
      },
    });
    reply.code(200).send({
      message: "Member assignement removed successfully",
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // if task or user is not found
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Records not found, please check your input",
        });
      }
    }
  }
}

export async function getUnassignedMembers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { workspaceId, taskId, page, search } =
    request.query as GetUnassignedMembersInput;

  let searchCondition = {};
  if (search) {
    searchCondition = {
      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  try {
    const unassignedMembers = await request.server.prisma.user.findMany({
      where: {
        ...searchCondition,
        workspaces: {
          some: {
            workspaceId: Number(workspaceId),
          },
        },
        assignments: {
          none: {
            taskId: Number(taskId),
          },
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
      skip: NUMBER_OF_USERS_PER_PAGE * page,
      take: NUMBER_OF_USERS_PER_PAGE,
    });
    const totalUnassignedMembers = await request.server.prisma.user.count({
      where: {
        ...searchCondition,
        workspaces: {
          some: {
            workspaceId: Number(workspaceId),
          },
        },
        assignments: {
          none: {
            taskId: Number(taskId),
          },
        },
      },
    });
    return reply.status(201).send({
      message: "successfully fetched the unassigned members",
      members: unassignedMembers,
      totalUsers: totalUnassignedMembers,
      totalPages: Math.ceil(totalUnassignedMembers / 10),
      rowsPerPage: NUMBER_OF_USERS_PER_PAGE,
    });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({
      message: "Failed to fetch unassigned members",
    });
  }
}

export async function getAssignements(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { taskId, search, page } = request.query as GetAssignementsInput;
  let searchCondition = {};
  if (search) {
    searchCondition = {
      user: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    };
  }

  try {
    const assignments = await request.server.prisma.assignment.findMany({
      where: {
        ...searchCondition,
        taskId: Number(taskId),
      },
      select: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      skip: NUMBER_OF_USERS_PER_PAGE * page,
      take: NUMBER_OF_USERS_PER_PAGE,
    });
    const totalAssignments = await request.server.prisma.user.count({
      where: {
        assignments: {
          some: {
            taskId: Number(taskId),
          },
        },
      },
    });
    const members = assignments.map((assignment) => assignment.user);
    return reply.status(201).send({
      message: "successfully fetched the assignments",
      members,
      totalUsers: totalAssignments,
      rowsPerPage: NUMBER_OF_USERS_PER_PAGE,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to fetch assignments",
    });
  }
}

export async function getTaskById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as GetTaskByIdInput;
  try {
    const task = await request.server.prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return reply.status(404).send({
        message: "Task not found",
      });
    }
    return reply.status(200).send({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to fetch task",
    });
  }
}
