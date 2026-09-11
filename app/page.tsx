import Image from "next/image";
import TodoCLient from "./components/TodoClient";
import { getTodoAction } from "./actions/todo.action";

export default async function Home() {
  const result = await getTodoAction();
  const todos = result?.data || [];
  return (
    <TodoCLient initialTodos={todos}/>
  );
}
