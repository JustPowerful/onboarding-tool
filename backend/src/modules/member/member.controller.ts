import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllMembersInput } from "./member.schema";

const MEMBER_PER_PAGE = 5;
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
        { firstname: { contains: search, mode: "insensitive" } },
        { lastname: { contains: search, mode: "insensitive" } },
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
        role: {
          not: "SUPERADMIN",
        },
      },
      skip: page * MEMBER_PER_PAGE,
      take: MEMBER_PER_PAGE,
    });
    const totalMembers = await request.server.prisma.user.count({
      where: {
        ...search_condition,
        ...role_condition,
        role: {
          not: "SUPERADMIN",
        },
      },
    });
    const totalPages = Math.ceil(totalMembers / MEMBER_PER_PAGE);

    return reply.code(200).send({
      members,
      totalMembers,
      totalPages,
      rowsPerPage: MEMBER_PER_PAGE,
    });
  } catch (error) {
    console.log(error);
    return reply.code(500).send({
      message: "Failed to get members",
    });
  }
}

// this is the function that will be called when the admin wants to delete a user completely from the database
export async function deleteMember() {}
