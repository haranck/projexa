import { z } from "zod";

const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional(),
    startDate: z.string().nullable().optional()
        .refine((val) => {
            if (!val) return true;
            return val >= getTodayStr();
        }, { message: "Start date cannot be in the past" }),
    endDate: z.string().nullable().optional()
        .refine((val) => {
            if (!val) return true;
            return val >= getTodayStr();
        }, { message: "End date cannot be in the past" }),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
});

export const epicSchema = z.object({
    title: z.string().min(1, "Epic name is required").max(200, "Epic name must be less than 200 characters"),
    description: z.string().optional(),
    startDate: z.string().nullable().optional()
        .refine((val) => {
            if (!val) return true;
            return val >= getTodayStr();
        }, { message: "Start date cannot be in the past" }),
    endDate: z.string().nullable().optional()
        .refine((val) => {
            if (!val) return true;
            return val >= getTodayStr();
        }, { message: "End date cannot be in the past" }),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
});

export type IssueSchemaType = z.infer<typeof issueSchema>;
export type EpicSchemaType = z.infer<typeof epicSchema>;
