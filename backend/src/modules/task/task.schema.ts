import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const taskCore = {
  name: z.string({}),
};

const createTaskSchema = z.object({
  ...taskCore,
  description: z.string({}).optional(),
  dueDate: z.string({}).optional(),
  checklistId: z.number({}),
});

const deleteTaskSchema = z.object({
  id: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "Task id is required",
  }),
});

const updateTaskSchema = z.object({
  id: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "Task id is required",
  }),
  ...taskCore,
  description: z.string({}).optional(),
  dueDate: z.string({}).optional(),
});

const assignMemberSchema = z.object({
  taskId: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "Task id is required",
  }),
  userId: z.number({
    invalid_type_error: "User id must be a number",
    required_error: "User id is required",
  }),
});

const removeAssignementSchema = z.object({
  taskId: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "User id is required",
  }),
  userId: z.number({
    invalid_type_error: "User id must be a number",
    required_error: "User id is required",
  }),
});

const getUnassignedMembersSchema = z.object({
  taskId: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "Task id is required",
  }),
  workspaceId: z.number({
    invalid_type_error: "Workspace id must be a number",
    required_error: "Workspace id is required",
  }),
  search: z.string({}).optional(),
  page: z.number({}),
});

const getAssignementsSchema = z.object({
  taskId: z.number({
    invalid_type_error: "Task id must be a number",
    required_error: "Task id is required",
  }),
  search: z.string({}).optional(),
  page: z.number({}),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignMemberInput = z.infer<typeof assignMemberSchema>;
export type RemoveAssignementInput = z.infer<typeof removeAssignementSchema>;
export type GetAssignementsInput = z.infer<typeof getAssignementsSchema>;
export type GetUnassignedMembersInput = z.infer<
  typeof getUnassignedMembersSchema
>;
export const { schemas: taskSchemas, $ref } = buildJsonSchemas(
  {
    createTaskSchema,
    deleteTaskSchema,
    updateTaskSchema,
    assignMemberSchema,
    removeAssignementSchema,
    getAssignementsSchema,
    getUnassignedMembersSchema,
  },
  {
    $id: "task",
  }
);

// Compare this snippet from backend/src/modules/checklist/checklist.controller.ts:
