import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
    .string({ message: "ID is required" })
    .regex(objectIdRegex, { message: "Invalid ID format (must be a 24-character hex string)" });

export const createProjectSchema = z.object({
    body: z.object({
        projectName: z
            .string({ message: "Project name is required" })
            .trim()
            .min(1, "Project name cannot be empty")
            .max(100, "Project name cannot exceed 100 characters"),
        key: z
            .string({ message: "Project key is required" })
            .trim()
            .min(2, "Project key must be at least 2 characters")
            .max(10, "Project key cannot exceed 10 characters"),
        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),
        workspaceId: objectIdSchema,
        members: z
            .array(
                z.object({
                    userId: objectIdSchema,
                    roleId: objectIdSchema,
                })
            )
            .optional(),
    }),
});

export const getAllProjectsSchema = z.object({
    params: z.object({
        workspaceId: objectIdSchema,
    }),
    query: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().optional().default(10),
        search: z.string().trim().optional(),
    }),
});

export const updateProjectSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        projectName: z
            .string()
            .trim()
            .min(1, "Project name cannot be empty")
            .max(100, "Project name cannot exceed 100 characters")
            .optional(),
        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),
        key: z
            .string()
            .trim()
            .min(2, "Project key must be at least 2 characters")
            .max(10, "Project key cannot exceed 10 characters")
            .optional(),
    }),
});

export const deleteProjectSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});

export const addProjectMemberSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        userId: objectIdSchema,
        roleId: objectIdSchema,
    }),
});

export const removeProjectMemberSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
        userId: objectIdSchema,
    }),
});

export const updateProjectMemberRoleSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        userId: objectIdSchema,
        roleId: objectIdSchema,
    }),
});

export const getProjectDashboardSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});
