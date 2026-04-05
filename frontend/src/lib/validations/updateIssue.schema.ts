import { z } from "zod";

export const updateIssueSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
});

export type UpdateIssueSchemaType = z.infer<typeof updateIssueSchema>;