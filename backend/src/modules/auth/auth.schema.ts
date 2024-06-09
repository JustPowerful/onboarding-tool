import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
// define the core user schema
const userCore = {
  firstname: z
    .string({
      invalid_type_error: "Firstname must be a string",
      required_error: "Firstname is required",
    })
    .min(2)
    .max(50),
  lastname: z
    .string({
      invalid_type_error: "Lastname must be a string",
      required_error: "Lastname is required",
    })
    .min(2)
    .max(50),
  role: z.enum(["MANAGER", "EMPLOYEE", "CLIENT"], {
    invalid_type_error: "Role must be a string",
    required_error: "Role is required",
  }),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Email is not valid",
    }),
};
// export the schema for the register user request
const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      invalid_type_error: "Password must be a string",
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
});

// export the schema for the login user request
const loginUserSchema = z.object({
  email: z.string().email({
    message: "Email is not valid",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  loginUserSchema,
});
