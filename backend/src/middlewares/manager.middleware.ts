import { FastifyReply, FastifyRequest } from "fastify";

// this middleware will check if the user is a manager
// notice: this middleware is implemented right after the authMiddleware
export async function managerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const currentUser = request.user;
  const fetchedUser = await request.server.prisma.user.findUnique({
    where: {
      id: Number(currentUser.sub),
    },
  });
  if (!fetchedUser) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
  if (fetchedUser.role !== "MANAGER") {
    return reply.code(403).send({ message: "Forbidden" });
  }
}
