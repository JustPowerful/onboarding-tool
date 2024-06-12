import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config(); // configure the environment variables

// prisma plugin
import prismaPlugin from "./plugins/prisma";

// routes
import authRoute from "./modules/auth/auth.route";
import workspaceRoute from "./modules/workspace/workspace.route";

import { userSchemas } from "./modules/auth/auth.schema";
import { workspaceSchemas } from "./modules/workspace/workspace.schema";
import { checklistSchemas } from "./modules/checklist/checklist.schema";
import checklistRoute from "./modules/checklist/checklist.route";

const server = Fastify();

// registering the schemas before registering the routes
for (const schema of [
  ...userSchemas,
  ...workspaceSchemas,
  ...checklistSchemas,
]) {
  server.addSchema(schema);
}

// registering plugins
server.register(prismaPlugin);

// registering routes
server.register(authRoute, { prefix: "/api/auth" });
server.register(workspaceRoute, { prefix: "/api/workspace" });
server.register(checklistRoute, { prefix: "/api/checklist" });

const PORT = 3000;
server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
