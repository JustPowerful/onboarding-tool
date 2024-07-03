import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const clientCore = {
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
};
const createClientSchema = z.object({
  ...clientCore,
});
const updateClientSchema = z.object({
  id: z.number(),
  ...clientCore,
});
const deleteClientSchema = z.object({
  id: z.number(),
});
const paginateClientSchema = z.object({
  page: z.number(),
  search: z.string().optional(),
});
const paginateWorkspaceClients = z.object({
  page: z.number(),
  inscribed: z.boolean(),
  search: z.string().optional(),
  workspaceId: z.number(),
});

const addClientToWorkspaceSchema = z.object({
  clientId: z.number(),
  workspaceId: z.number(),
});
const removeClientFromWorkspaceSchema = addClientToWorkspaceSchema; // the same
const updateClientStatusSchema = z.object({
  clientId: z.number(),
  workspaceId: z.number(),
  status: z.enum(["DEVELOPMENT", "REVIEW", "APPROVED", "REJECTED"]),
});

export type createClientInput = z.infer<typeof createClientSchema>;
export type updateClientInput = z.infer<typeof updateClientSchema>;
export type deleteClientInput = z.infer<typeof deleteClientSchema>;
export type paginateClientInput = z.infer<typeof paginateClientSchema>;
export type paginateWorkspaceClientsInput = z.infer<
  typeof paginateWorkspaceClients
>;
export type addClientToWorkspaceInput = z.infer<
  typeof addClientToWorkspaceSchema
>;
export type removeClientFromWorkspaceInput = z.infer<
  typeof removeClientFromWorkspaceSchema
>;
export type updateClientStatusInput = z.infer<typeof updateClientStatusSchema>;
export const { schemas: clientSchemas, $ref } = buildJsonSchemas(
  {
    createClientSchema,
    updateClientSchema,
    deleteClientSchema,
    paginateClientSchema,
    paginateWorkspaceClients,
    addClientToWorkspaceSchema,
    removeClientFromWorkspaceSchema,
    updateClientStatusSchema,
  },
  { $id: "client" }
);
