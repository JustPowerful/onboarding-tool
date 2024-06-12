import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateChecklistInput,
  DeleteChecklistInput,
  UpdateChecklistInput,
  updateChecklistOrderInput,
} from "./checklist.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function createChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // create a new checklist
  const { name, workspaceId } = request.body as CreateChecklistInput;
  // fetch the workspace checklists to calculate the position of the new checklist
  try {
    const checklists = await request.server.prisma.checklist.findMany({
      where: {
        workspaceId: Number(workspaceId),
      },
      orderBy: {
        pos: "desc",
      },
    });

    var order: number;
    if (checklists.length === 0) {
      order = 0;
    } else {
      order = checklists[0].pos + 1;
    }

    await request.server.prisma.checklist.create({
      data: {
        name: name,
        workspaceId: Number(workspaceId),
        pos: order,
      },
    });
    return reply.code(201).send({ message: "Checklist created successfully" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return reply.code(404).send({
          message: "Workspace not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // delete a checklist
  const { id } = request.params as DeleteChecklistInput;
  try {
    await request.server.prisma.checklist.delete({
      where: {
        id: Number(id),
      },
    });
    return reply.code(200).send({ message: "Checklist deleted successfully" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Cannot delete the checklist because its not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function getAllChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // get all the checklists
  const { workspaceId } = request.params as { workspaceId: string };
  try {
    const checklists = await request.server.prisma.checklist.findMany({
      where: {
        workspaceId: Number(workspaceId),
      },
      orderBy: {
        pos: "asc",
      },
      include: {
        tasks: {
          include: {
            assignements: {
              include: {
                user: true,
              },
            },
            proposals: true,
          },
        },
      },
    });
    return reply.code(200).send({
      message: "Checklists fetched successfully",
      checklists: checklists,
    });
  } catch (error) {
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
export async function updateChecklistOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { checklists } = request.body as updateChecklistOrderInput;
  try {
    checklists.forEach(async (checklist, index) => {
      await request.server.prisma.checklist.update({
        where: {
          id: checklist.id,
        },
        data: {
          pos: index,
        },
      });
    });
    return reply
      .code(200)
      .send({ message: "Checklists order updated successfully" });
  } catch (error) {
    // if some update fails because of the id not found
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Cannot update the checklist because its not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function updateChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, name } = request.body as UpdateChecklistInput;
  try {
    await request.server.prisma.checklist.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });
    return reply.code(200).send({ message: "Checklist updated successfully" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.code(404).send({
          message: "Cannot update the checklist because its not found",
        });
      }
    }
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}
