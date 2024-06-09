import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config(); // configure the environment variables

// prisma plugin
import prismaPlugin from "./plugins/prisma";

// routes
import authRoute from "./modules/auth/auth.route";
import { userSchemas } from "./modules/auth/auth.schema";

const server = Fastify();

// registering the schemas before registering the routes
for (const schema of userSchemas) {
  server.addSchema(schema);
}

// registering plugins
server.register(prismaPlugin);

// registering routes
server.register(authRoute, { prefix: "/api/auth" });

const PORT = 3000;
server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
