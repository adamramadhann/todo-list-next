"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createTodoAction,
  deleteTodoAction,
  getTodoAction,
  updateTodoAction,
} from "../actions/todo.action";
import { TodoClientProps, todoType } from "../types/todo.type";

export default function TodoCLient({ initialTodos }: TodoClientProps) {
  const [isActive, setIsActive] = useState<todoType | null>(null);
  const [isDeleting, startTransition] = useTransition();
  const [state, formActtion, isPandding] = useActionState(
    createTodoAction,
    null,
  );

  const handleDeleteTodo = (todo: string, id: string) => {
    if (!confirm(`yakin ingin hapus list ${todo} ?? `)) return;

    startTransition(async () => {
      await deleteTodoAction(id);
    });
  };

  console.log("ini data transaction: ", state);

  const handleUpdated = async (formData: FormData) => {
    if (!isActive?.id) return alert("id tidak ditemukan");

    const textTodo = formData.get("text") as string;

    if (!textTodo || textTodo.trim() === "")
      return alert("input tidak boleh kosong");

    startTransition(async () => {
      await updateTodoAction(isActive.id, {
        ...isActive,
        text: textTodo,
      });
      setIsActive(null);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              3 dari 5 tugas selesai
            </p>
          </div>

          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <span className="text-xs font-bold text-emerald-400">60%</span>
          </div>
        </div>

        <form action={formActtion} className="flex gap-3 mb-6 relative z-10">
          <input
            name="text"
            type="text"
            placeholder="Tambah tugas baru..."
            className="flex-1 bg-slate-800/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
          />
          <button
            // onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 text-slate-950 font-bold px-5 py-3 rounded-2xl text-sm transition-all duration-150 shadow-[0_4px_0_0_#047857] active:shadow-none flex items-center justify-center"
          >
            +
          </button>
        </form>
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/40 border border-white/5 rounded-2xl relative z-10">
          <button className="flex-1 py-1.5 text-xs font-medium rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all">
            Semua
          </button>
          <button className="flex-1 py-1.5 text-xs font-medium rounded-xl text-slate-400 hover:text-slate-200 transition-all">
            Aktif
          </button>
          <button className="flex-1 py-1.5 text-xs font-medium rounded-xl text-slate-400 hover:text-slate-200 transition-all">
            Selesai
          </button>
        </div>

        <div className="space-y-3 relative z-10">
          {initialTodos?.map((e: todoType) => (
            <div
              key={e.id}
              className="group flex items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-black/10 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-6 h-6 rounded-lg border border-white/20 bg-slate-700/40 flex items-center justify-center transition-all duration-200 group-hover:border-emerald-400 shadow-[0_2px_0_0_rgba(255,255,255,0.05)]"></div>
                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  {e.text}
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Hari ini
              </span>
              <button onClick={() => handleDeleteTodo(e.text, e.id)}>X</button>
              <button onClick={() => setIsActive(e)}>edit</button>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 relative z-10">
          <span>Auto-saved</span>
          <button
            type="button"
            className="hover:text-slate-300 transition-colors"
          >
            Hapus Selesai
          </button>
        </div>
      </div>
      {isActive && (
        <form action={handleUpdated} className="mt-4 flex gap-2 relative z-10">
          <input
            type="text"
            name="text" // 👈 WAJIB ADA agar formData.get("text") bisa membaca nilainya
            defaultValue={isActive.text} // 👈 Tampilkan teks todo saat ini sebagai default
            placeholder="Input teks baru..."
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setIsActive(null)}
            className="text-xs text-slate-400 px-2"
          >
            Batal
          </button>
        </form>
      )}
    </div>
  );
}
