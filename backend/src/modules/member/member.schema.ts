import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getAllMembersSchema = z.object({
  search: z.string({}).optional(),
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
