import { FastifyInstance } from "fastify";
import {
  loginUserHandler,
  registerUserHandler,
  meHanlder,
} from "./auth.controller";
import { $ref } from "./auth.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";

async function authRoute(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        body: $ref("createUserSchema"),
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginUserSchema"),
      },
    },
    loginUserHandler
  );
  server.get(
    "/me",
    {
      preHandler: [authMiddleware],
    },
    meHanlder
  );
}
export default authRoute;
