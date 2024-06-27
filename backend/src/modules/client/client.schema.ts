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

export type createClientInput = z.infer<typeof createClientSchema>;
export type updateClientInput = z.infer<typeof updateClientSchema>;
export type deleteClientInput = z.infer<typeof deleteClientSchema>;
export type paginateClientInput = z.infer<typeof paginateClientSchema>;
export const { schemas: clientSchemas, $ref } = buildJsonSchemas(
  {
    createClientSchema,
    updateClientSchema,
    deleteClientSchema,
    paginateClientSchema,
  },
  { $id: "client" }
);
