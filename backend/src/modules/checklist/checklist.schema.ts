import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const checklistCore = {
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(2)
    .max(50),
  workspaceId: z.number({
    invalid_type_error: "WorkspaceId must be a number",
    required_error: "WorkspaceId is number",
  }),
};

const createChecklistSchema = z.object({
  ...checklistCore,
});

const updateChecklistOrderSchema = z.object({
  checklists: z.array(
    z.object({
      id: z.number({
        invalid_type_error: "Id must be a number",
        required_error: "Id is required",
      }),
      name: z
        .string({
          invalid_type_error: "Name must be a string",
          required_error: "Name is required",
        })
        .min(2)
        .max(50),
      workspaceId: z.number({
        invalid_type_error: "WorkspaceId must be a number",
        required_error: "WorkspaceId is number",
      }),
      pos: z.number({
        invalid_type_error: "Pos must be a number",
        required_error: "Pos is number",
      }),
      tasks: z
        .array(
          z.object({
            id: z.number({
              invalid_type_error: "Id must be a number",
              required_error: "Id is required",
            }),
            name: z
              .string({
                invalid_type_error: "Name must be a string",
                required_error: "Name is required",
              })
              .min(2)
              .max(50),
            pos: z.number({
              invalid_type_error: "Pos must be a number",
              required_error: "Pos is number",
            }),
          })
        )
        .optional(),
    })
  ),
});

const updateChecklistSchema = z.object({
  id: z.number({
    invalid_type_error: "Id must be a number",
    required_error: "Id is required",
  }),
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(2)
    .max(50),
  // tasks: z.array(
  //   z.object({
  //     id: z.number({
  //       invalid_type_error: "Id must be a number",
  //       required_error: "Id is required",
  //     }),
  //     name: z
  //       .string({
  //         invalid_type_error: "Name must be a string",
  //         required_error: "Name is required",
  //       })
  //       .min(2)
  //       .max(50),
  //     pos: z.number({
  //       invalid_type_error: "Pos must be a number",
  //       required_error: "Pos is number",
  //     }),
  //   })
  // ),
});

const deleteChecklistSchema = z.object({
  id: z.number({
    invalid_type_error: "Id must be a number",
    required_error: "Id is required",
  }),
});

export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;
export type updateChecklistOrderInput = z.infer<
  typeof updateChecklistOrderSchema
>;
export type UpdateChecklistInput = z.infer<typeof updateChecklistSchema>;
export type DeleteChecklistInput = z.infer<typeof deleteChecklistSchema>;
export const { schemas: checklistSchemas, $ref } = buildJsonSchemas(
  {
    createChecklistSchema,
    updateChecklistOrderSchema,
    updateChecklistSchema,
    deleteChecklistSchema,
  },
  { $id: "checklist" }
);
