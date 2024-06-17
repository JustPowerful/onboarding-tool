import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateTaskInput,
  DeleteTaskInput,
  UpdateTaskInput,
} from "./task.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
