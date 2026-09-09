import { prisma } from "../lib/prisma";
import type { TodoInput } from "../schemas/todo.schema";

// TodoInput (dari zod) dipakai sebagai tipe INPUT create/update.
// createdAt/updatedAt tidak termasuk karena diisi otomatis oleh database.

export const getTodo = async () => {
    return prisma.todo.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
};

export const deleteTodo = async (id: string) => {
    return prisma.todo.delete({
        where: { id }
    })
};

export const updateTodo = async (id: string, data: TodoInput) => {
    return prisma.todo.update({
        where: { id },
        data: {
            text: data.text,
            completed: data.completed
        }
    })
};

export const createTodo = async (data: TodoInput) => {
    return prisma.todo.create({
        data: {
            text: data.text,
            completed: data.completed
        }
    })
};
