import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const proposalCore = {
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name is required",
  }),
  description: z.string({
    invalid_type_error: "Description must be a string",
    required_error: "Description is required",
  }),
  stack: z
    .string({
      invalid_type_error: "Stack must be a string",
    })
    .optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"], {}).optional(),
};

const createProposalSchema = z.object({
  ...proposalCore,
  taskId: z.number({
    invalid_type_error: "TaskId must be a number",
    required_error: "TaskId is required",
  }),
  userId: z.number({
    invalid_type_error: "UserId must be a number",
    required_error: "UserId is required",
  }),
});

const updateProposalSchema = z.object({
  id: z.number({
    invalid_type_error: "Id must be a number",
    required_error: "Id is required",
  }),
  ...proposalCore,
});

const deleteProposalSchema = z.object({
  id: z.number({
    invalid_type_error: "Id must be a number",
    required_error: "Id is required",
  }),
});

const paginateProposalSchema = z.object({
  taskId: z.number(),
  page: z.number(),
  status: proposalCore.status, // this is still optional
});
const getProposalByIdSchema = z.object({ id: z.number() });

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type DeleteProposalInput = z.infer<typeof deleteProposalSchema>;
export type PaginateProposalInput = z.infer<typeof paginateProposalSchema>;
export type GetProposalByIdInput = z.infer<typeof getProposalByIdSchema>;
export const { schemas: proposalSchemas, $ref } = buildJsonSchemas(
  {
    createProposalSchema,
    updateProposalSchema,
    deleteProposalSchema,
    paginateProposalSchema,
    getProposalByIdSchema,
  },
  { $id: "proposal" }
);
