import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
    .string({ message: "ID is required" })
    .regex(objectIdRegex, { message: "Invalid ID format (must be a 24-character hex string)" });

export const scheduleMeetingSchema = z.object({
    body: z.object({
        title: z
            .string({ message: "Title is required" })
            .trim()
            .min(1, "Title cannot be empty")
            .max(100, "Title cannot exceed 100 characters"),
        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),
        startTime: z.coerce.date({
            message: "Invalid start time format",
        }),
        endTime: z.coerce.date({
            message: "Invalid end time format",
        }),
        projectId: objectIdSchema,
        invitees: z
            .array(objectIdSchema)
            .default([]),
    }).refine((data) => data.endTime > data.startTime, {
        message: "End time must be after start time",
        path: ["endTime"],
    }),
});

export const rescheduleMeetingSchema = z.object({
    body: z.object({
        meetingId: objectIdSchema,
        title: z
            .string()
            .trim()
            .min(1, "Title cannot be empty")
            .max(100, "Title cannot exceed 100 characters")
            .optional(),
        description: z
            .string()
            .trim()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),
        startTime: z.coerce.date({
            message: "Invalid start time format",
        }).optional(),
        endTime: z.coerce.date({
            message: "Invalid end time format",
        }).optional(),
        projectId: objectIdSchema.optional(),
        invitees: z
            .array(objectIdSchema)
            .optional(),
    }).refine((data) => {
        if (data.startTime && data.endTime) {
            return data.endTime > data.startTime;
        }
        return true;
    }, {
        message: "End time must be after start time",
        path: ["endTime"],
    }),
});

export const getProjectMeetingsSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});

export const meetingIdParamSchema = z.object({
    params: z.object({
        meetingId: objectIdSchema,
    }),
});
