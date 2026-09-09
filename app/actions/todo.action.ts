"use server"

import { revalidatePath } from "next/cache";
import { createTodo, deleteTodo, getTodo, updateTodo } from "../service/product.service";
import { todoSchema } from "../schemas/todo.schema";
import type { TodoInput } from "../schemas/todo.schema";
import { z } from "zod";

// Semua action mengembalikan bentuk yang seragam:
//   berhasil → { success: true, data?: ... }
//   gagal    → { success: false, error: ... }

export const createTodoAction = async (formData: FormData) => {
    const text = formData.get("text");
    const rawCompleted = formData.get("completed");

    // FormData hanya mengangkut string: checkbox HTML mengirim "on",
    // sedangkan input tersembunyi bisa mengirim "true"/"false".
    const completed = rawCompleted === "on" || rawCompleted === "true";

    const result = todoSchema.safeParse({ text, completed });

    if (!result.success) {
        return {
            success: false,
            error: z.flattenError(result.error).fieldErrors
        };
    }

    try {
        const todo = await createTodo(result.data);
        revalidatePath("/");

        return {
            success: true,
            data: todo
        };
    } catch {
        return {
            success: false,
            error: "Gagal membuat todo"
        };
    }
};

export const getTodoAction = async () => {
    try {
        const todos = await getTodo();

        return {
            success: true,
            data: todos
        };
    } catch {
        return {
            success: false,
            error: "Gagal mengambil data todo"
        };
    }
};

export const updateTodoAction = async (id: string, data: TodoInput) => {
    // Input dari client dianggap tidak terpercaya — validasi ulang lewat schema.
    const result = todoSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            error: z.flattenError(result.error).fieldErrors
        };
    }

    try {
        const todo = await updateTodo(id, result.data);
        revalidatePath("/");

        return {
            success: true,
            data: todo
        };
    } catch {
        return {
            success: false,
            error: "Gagal memperbarui todo"
        };
    }
};

export const deleteTodoAction = async (id: string) => {
    try {
        await deleteTodo(id);
        revalidatePath("/");

        return {
            success: true
        };
    } catch {
        return {
            success: false,
            error: "Gagal menghapus todo"
        };
    }
};
