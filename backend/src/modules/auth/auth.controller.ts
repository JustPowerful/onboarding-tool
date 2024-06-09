import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { CreateUserInput, LoginUserInput } from "./auth.schema";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function registerUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { firstname, lastname, email, password, role } =
    request.body as CreateUserInput;
  const hashedPassword = await bcrypt.hash(password, 10);
  // create the user in the database
  try {
    await request.server.prisma.user.create({
      data: {
        firstname,
        lastname,
        role,
        email,
        password: hashedPassword,
      },
    });
    return reply.code(201).send({ success: true, message: "User created" });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply
          .code(400)
          .send({ success: false, message: "Email already exists" });
      } else {
        return reply
          .code(500)
          .send({ success: false, message: "Internal server error" });
      }
    } else {
      return reply
        .code(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
}
export async function loginUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as LoginUserInput;
  const user = await request.server.prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return reply
      .code(401)
      .send({ success: false, message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return reply
      .code(401)
      .send({ success: false, message: "Invalid email or password" });
  }
  const token = jwt.sign(
    { sub: user.id, firstname: user.firstname, lastname: user.lastname },
    process.env.JWT_SECRET!
  );
  return reply.code(200).send({ token });
}
export async function meHanlder(request: FastifyRequest, reply: FastifyReply) {
  const user = await request.server.prisma.user.findUnique({
    where: {
      id: Number(request.user.sub),
    },
  });
  if (!user) {
    return reply.code(404).send({ success: false, message: "User not found" });
  }
  return reply.code(200).send({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  });
}
