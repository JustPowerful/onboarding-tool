import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllMembersInput } from "./member.schema";

export async function getAllMembers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { search, page, role } = request.query as GetAllMembersInput;
  var search_condition = {};
  var role_condition = {};
  if (search) {
    search_condition = {
      OR: [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
      ],
    };
  }
  if (role) {
    role_condition = {
      role: role,
    };
  }
  try {
    const members = await request.server.prisma.user.findMany({
      where: {
        ...search_condition,
        ...role_condition,
      },
      skip: page * 10,
      take: 10,
    });

    return reply.code(200).send({
      members,
    });
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      message: "Failed to get members",
    });
  }
}
