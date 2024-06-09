import fp from "fastify-plugin"; // without skip-override property
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient();
  server.decorate("prisma", prisma);

  // to disconnect the prisma client when the server closes
  server.addHook("onClose", async (server) => {
    server.prisma.$disconnect();
  });
});

export default prismaPlugin;
