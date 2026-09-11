"use server";

import { revalidatePath } from "next/cache";
import {
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
} from "../service/product.service";
import { todoSchema } from "../schemas/todo.schema";
import type { TodoInput } from "../schemas/todo.schema";
import { z } from "zod";

// Semua action mengembalikan bentuk yang seragam:
//   berhasil → { success: true, data?: ... }
//   gagal    → { success: false, error: ... }

export const createTodoAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const text = formData.get("text");
  const rawCompleted = formData.get("completed");

  // Jika rawCompleted null, biarkan undefined agar Zod memakai nilai default(false)
  const completed = rawCompleted
    ? rawCompleted === "on" || rawCompleted === "true"
    : undefined;

  // Passing object ke Zod
  const result = todoSchema.safeParse({ text, completed });

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  // result.data.completed otomatis bernilai false jika tadi undefined
  try {
    const todo = await createTodo(result.data);
    revalidatePath("/");

    return {
      success: true,
      data: todo,
    };
  } catch {
    return {
      success: false,
      error: "Gagal membuat todo",
    };
  }
};

export const getTodoAction = async () => {
  try {
    const todos = await getTodo();

    return {
      success: true,
      data: todos,
    };
  } catch {
    return {
      success: false,
      error: "Gagal mengambil data todo",
    };
  }
};

export const updateTodoAction = async (id: string, data: TodoInput) => {
  const result = todoSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const todo = await updateTodo(id, result.data);
    revalidatePath("/");

    return {
      success: true,
      data: todo,
    };
  } catch {
    return {
      success: false,
      error: "Gagal memperbarui todo",
    };
  }
};

export const deleteTodoAction = async (id: string) => {
  try {
    await deleteTodo(id);
    revalidatePath("/");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Gagal menghapus todo",
    };
  }
};
