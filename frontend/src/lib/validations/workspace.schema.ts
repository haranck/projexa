import { z } from "zod";

export const workspaceSchema = z.object({
    workspaceName: z.string().min(3, "Workspace name must be at least 3 characters long").max(50, "Workspace name must be at most 50 characters long"),
    description: z.string().max(100, "Description must be at most 100 characters long"),
})

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>
