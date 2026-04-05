import { z } from "zod";

export const scheduleMeetingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    invitees: z.array(z.string()).min(1, "Select at least one attendee"),
}).refine((data) => {
    if (!data.date || !data.startTime) return true;
    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    return startDateTime > new Date();
}, {
    message: "Meeting must be scheduled for a future time",
    path: ["startTime"],
}).refine((data) => {
    if (!data.startTime || !data.endTime) return true;
    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    const endDateTime = new Date(`${data.date}T${data.endTime}`);
    return endDateTime > startDateTime;
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});

export type ScheduleMeetingFormValues = z.infer<typeof scheduleMeetingSchema>;
