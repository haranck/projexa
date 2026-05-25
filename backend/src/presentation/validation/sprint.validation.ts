import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
    .string({ message: "ID is required" })
    .regex(objectIdRegex, { message: "Invalid ID format (must be a 24-character hex string)" });

export const moveIssueToSprintSchema = z.object({
    params: z.object({
        issueId: objectIdSchema,
    }),
    body: z.object({
        sprintId: objectIdSchema.nullable(),
    }),
});

export const createSprintSchema = z.object({
    body: z.object({
        workspaceId: objectIdSchema,
        projectId: objectIdSchema,
    }),
});

export const deleteSprintSchema = z.object({
    params: z.object({
        sprintId: objectIdSchema,
    }),
});

export const startSprintSchema = z.object({
    params: z.object({
        sprintId: objectIdSchema,
    }),
    body: z.object({
        startDate: z.coerce.date({
            message: "Invalid start date format",
        }),
        endDate: z.coerce.date({
            message: "Invalid end date format",
        }),
        goal: z
            .string()
            .trim()
            .max(200, "Goal cannot exceed 200 characters")
            .optional(),
    }).refine((data) => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});

export const getSprintsSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});

export const completeSprintSchema = z.object({
    params: z.object({
        sprintId: objectIdSchema,
    }),
    body: z.object({
        moveIncompleteIssuesToSprintId: objectIdSchema.optional(),
    }),
});
