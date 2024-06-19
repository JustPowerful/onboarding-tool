import { Role } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";

const roleMiddleware = (roles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request;
    if (!user) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }
    const User = await request.server.prisma.user.findUnique({
      where: {
        id: Number(user.sub),
      },
    });
    if (!User) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }
    if (!roles.includes(User.role)) {
      reply.code(403).send({ message: "Forbidden" });
      return;
    }
  };
};

export default roleMiddleware;
