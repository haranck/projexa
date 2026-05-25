import { z } from "zod";
import { IssueType, IssueStatus } from "../../domain/enums/IssueEnums";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
    .string({ message: "ID is required" })
    .regex(objectIdRegex, { message: "Invalid ID format (must be a 24-character hex string)" });

const attachmentSchema = z.object({
    type: z.enum(["link", "file"], {
        message: "Attachment type must be 'link' or 'file'",
    }),
    url: z.string({ message: "Attachment URL is required" }).url("Invalid URL format"),
    fileName: z.string().trim().optional(),
});

export const createIssueSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        workspaceId: objectIdSchema,
        title: z
            .string({ message: "Title is required" })
            .trim()
            .min(1, "Title cannot be empty")
            .max(200, "Title cannot exceed 200 characters"),
        description: z
            .string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters")
            .optional(),
        issueType: z.nativeEnum(IssueType, {
            message: "Invalid issue type",
        }),
        status: z.nativeEnum(IssueStatus, {
            message: "Invalid issue status",
        }).optional(),
        attachments: z.array(attachmentSchema).optional(),
        parentIssueId: objectIdSchema.nullable().optional(),
        sprintId: objectIdSchema.nullable().optional(),
        assigneeId: objectIdSchema.nullable().optional(),
        startDate: z.coerce.date({
            message: "Invalid start date format",
        }).nullable().optional(),
        endDate: z.coerce.date({
            message: "Invalid end date format",
        }).nullable().optional(),
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            return data.endDate > data.startDate;
        }
        return true;
    }, {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});

export const getAttachmentUploadUrlSchema = z.object({
    body: z.object({
        contentType: z
            .string({ message: "Content type is required" })
            .trim()
            .min(1, "Content type cannot be empty"),
    }),
});

export const updateEpicSchema = z.object({
    params: z.object({
        issueId: objectIdSchema,
    }),
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title cannot be empty")
            .max(200, "Title cannot exceed 200 characters")
            .optional(),
        description: z
            .string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters")
            .optional(),
        status: z.nativeEnum(IssueStatus, {
            message: "Invalid issue status",
        }).optional(),
        assigneeId: objectIdSchema.nullable().optional(),
        attachments: z.array(attachmentSchema).optional(),
        startDate: z.coerce.date({
            message: "Invalid start date format",
        }).nullable().optional(),
        endDate: z.coerce.date({
            message: "Invalid end date format",
        }).nullable().optional(),
        comment: z.string().trim().optional(),
        mentionedUserIds: z.array(objectIdSchema).optional(),
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            return data.endDate > data.startDate;
        }
        return true;
    }, {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});

export const deleteIssueSchema = z.object({
    params: z.object({
        issueId: objectIdSchema,
    }),
});

export const getAllIssuesSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    query: z.object({
        assigneeId: objectIdSchema.optional(),
        issueType: z.string().trim().optional(),
        sprintId: objectIdSchema.nullable().optional(),
        dateFilter: z.enum(["RECENT", "DUE_SOON"]).optional(),
    }),
});
