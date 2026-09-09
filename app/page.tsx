import Image from "next/image";
import TodoCLient from "./components/TodoClient";
import { getTodoAction } from "./actions/todo.action";

export default function Home() {

  const getTodo = async () => {
    const response = await getTodoAction();
    
    return response
}

console.log(getTodo)
  
  return (
<TodoCLient/>
  );
}
