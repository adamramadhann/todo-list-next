import { z } from "zod";


export const todoSchema = z.object({
    text: z.string().min(1, "You must submit a to-do list!"),
    completed: z.boolean().default(false),
});

// Kontrak INPUT untuk create/update — diturunkan dari schema agar tidak ada duplikasi.
export type TodoInput = z.infer<typeof todoSchema>;
