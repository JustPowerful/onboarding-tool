import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config(); // configure the environment variables

// prisma plugin
import prismaPlugin from "./plugins/prisma";

// routes
import authRoute from "./modules/auth/auth.route";
import workspaceRoute from "./modules/workspace/workspace.route";
import checklistRoute from "./modules/checklist/checklist.route";
import taskRoute from "./modules/task/task.route";
import memberRoute from "./modules/member/member.route";

// schemas
import { userSchemas } from "./modules/auth/auth.schema";
import { workspaceSchemas } from "./modules/workspace/workspace.schema";
import { checklistSchemas } from "./modules/checklist/checklist.schema";
import { taskSchemas } from "./modules/task/task.schema";
import { memberSchemas } from "./modules/member/member.schema";
import { proposalSchemas } from "./modules/proposal/proposal.schema";
import proposalRoute from "./modules/proposal/proposal.route";
import { clientSchemas } from "./modules/client/client.schema";
import clientRoute from "./modules/client/client.route";

const server = Fastify();

// registering the schemas before registering the routes
for (const schema of [
  ...userSchemas,
  ...workspaceSchemas,
  ...checklistSchemas,
  ...taskSchemas,
  ...memberSchemas,
  ...proposalSchemas,
  ...clientSchemas,
]) {
  server.addSchema(schema);
}

// registering plugins
server.register(prismaPlugin);

// registering routes
server.register(authRoute, { prefix: "/api/auth" });
server.register(workspaceRoute, { prefix: "/api/workspace" });
server.register(checklistRoute, { prefix: "/api/checklist" });
server.register(taskRoute, { prefix: "/api/task" });
server.register(memberRoute, { prefix: "/api/member" });
server.register(proposalRoute, { prefix: "/api/proposal" });
server.register(clientRoute, { prefix: "/api/client" });

const PORT = 3000;
server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
