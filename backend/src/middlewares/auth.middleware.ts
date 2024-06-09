import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization;
  if (!token) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2) {
    return reply
      .code(401)
      .send({ message: "Unauthorized: The user token is invalid" });
  }
  const [scheme, tokenValue] = tokenParts;

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET as string);
    request.user = decoded as {
      sub: string;
      firstname: string;
      lastname: string;
    };
  } catch (error) {
    return reply
      .code(401)
      .send({ message: "Unauthorized: The user token is invalid" });
  }
}
