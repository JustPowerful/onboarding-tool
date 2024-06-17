import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const workspaceCore = {
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(150, { message: "Name must be at most 150 characters long" }),
};

const createWorkspaceSchema = z.object({
  ...workspaceCore,
});
const deleteWorkspaceSchema = z.object({
  id: z.string({
    invalid_type_error: "Id must be a string",
    required_error: "Id is required",
  }),
});

const updateWorkspaceSchema = z.object({
  id: z.string({
    invalid_type_error: "Id must be a string",
    required_error: "Id is required",
  }),
  ...workspaceCore,
});

const getWorkspaceSchema = z.object({
  id: z.string({
    invalid_type_error: "Id must be a string",
    required_error: "Id is required",
  }),
});

const addMemberSchema = z.object({
  workspaceId: z.number({
    invalid_type_error: "WorkspaceId must be a number",
    required_error: "WorkspaceId is number",
  }),
  userId: z.number({
    invalid_type_error: "UserId must be a number",
    required_error: "UserId is number",
  }),
});

const removeMemberSchema = z.object({
  workspaceId: z.number({
    invalid_type_error: "WorkspaceId must be a number",
    required_error: "WorkspaceId is number",
  }),
  userId: z.number({
    invalid_type_error: "UserId must be a number",
    required_error: "UserId is number",
  }),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type GetWorkspaceInput = z.infer<typeof getWorkspaceSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export const { schemas: workspaceSchemas, $ref } = buildJsonSchemas(
  {
    createWorkspaceSchema,
    deleteWorkspaceSchema,
    updateWorkspaceSchema,
    getWorkspaceSchema,
    addMemberSchema,
    removeMemberSchema,
  },
  { $id: "workspace" }
);
