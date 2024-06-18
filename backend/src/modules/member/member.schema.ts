import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getAllMembersSchema = z.object({
  search: z
    .string({
      invalid_type_error: "Search must be a string",
    })
    .optional(),
  page: z.number({}),
  role: z.enum(["MANAGER", "CLIENT", "EMPLOYEE"]).optional(),
});

export type GetAllMembersInput = z.infer<typeof getAllMembersSchema>;
export const { schemas: memberSchemas, $ref } = buildJsonSchemas(
  {
    getAllMembersSchema,
  },
  {
    $id: "member",
  }
);
