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

const deleteMemberSchema = z.object({
  id: z.string({
    invalid_type_error: "Id must be a string",
    required_error: "Id is required",
  }),
});

export type GetAllMembersInput = z.infer<typeof getAllMembersSchema>;
export type DeleteMemberInput = z.infer<typeof deleteMemberSchema>;
export const { schemas: memberSchemas, $ref } = buildJsonSchemas(
  {
    getAllMembersSchema,
    deleteMemberSchema,
  },
  {
    $id: "member",
  }
);
