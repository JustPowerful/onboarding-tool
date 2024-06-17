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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export const { schemas: taskSchemas, $ref } = buildJsonSchemas(
  {
    createTaskSchema,
    deleteTaskSchema,
    updateTaskSchema,
  },
  {
    $id: "task",
  }
);
// Compare this snippet from backend/src/modules/checklist/checklist.controller.ts:
