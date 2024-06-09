import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      sub: string;
      firstname: string;
      lastname: string;
    };
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export {};
