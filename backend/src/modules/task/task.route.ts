import { FastifyInstance } from "fastify";
import {
  assignMember,
  createTask,
  deleteTask,
  getAssignements,
  getUnassignedMembers,
  removeAssignement,
  updateTask,
} from "./task.controller";
import { $ref } from "./task.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import roleMiddleware from "../../middlewares/role.middleware";

async function taskRoute(server: FastifyInstance) {
  server.post(
    "/create",
    {
      schema: {
        body: $ref("createTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    createTask
  );
  server.patch(
    "/update",
    {
      schema: {
        body: $ref("updateTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    updateTask
  );
  server.delete(
    "/delete/:id",
    {
      schema: {
        params: $ref("deleteTaskSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    deleteTask
  );

  server.post(
    "/assignmember",
    {
      schema: {
        body: $ref("assignMemberSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER"])],
    },
    assignMember
  );
  server.delete(
    "/removeassignement",

    {
      schema: {
        body: $ref("removeAssignementSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER"])],
    },
    removeAssignement
  );
  server.get(
    "/getassignements",
    {
      schema: {
        querystring: $ref("getAssignementsSchema"),
      },
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
    },
    getAssignements
  );
  server.get(
    "/getunassignedmembers",
    {
      preHandler: [authMiddleware, roleMiddleware(["MANAGER", "EMPLOYEE"])],
      schema: {
        querystring: $ref("getUnassignedMembersSchema"),
      },
    },
    getUnassignedMembers
  );
}

export default taskRoute;
