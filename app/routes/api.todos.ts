import { todoStore } from "~/lib/todo-store";
import type { Route } from "./+types/api.todos";

export async function action({ request }: Route.ActionArgs) {
  const method = request.method;

  switch (method) {
    case "POST": {
      console.log("POST /api/todos");
      const formData = await request.formData();
      const title = formData.get("title") as string;

      if (!title?.trim()) {
        return { error: "Title is required", status: 400 };
      }

      const todo = todoStore.create(title.trim());
      return { todo, status: 201 };
    }

    case "PUT": {
      console.log("PUT /api/todos");
      const formData = await request.formData();
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const completed = formData.get("completed") === "true";

      if (!id) {
        return { error: "ID is required", status: 400 };
      }

      const updates: any = {};
      if (title !== undefined) updates.title = title;
      if (formData.has("completed")) updates.completed = completed;

      const todo = todoStore.update(id, updates);
      if (!todo) {
        return { error: "Todo not found", status: 404 };
      }

      return todo;
    }

    case "DELETE": {
      console.log("DELETE /api/todos");
      const formData = await request.formData();
      const id = formData.get("id") as string;

      if (!id) {
        return { error: "ID is required", status: 400 };
      }

      const deleted = todoStore.delete(id);
      if (!deleted) {
        return { error: "Todo not found", status: 404 };
      }

      return { success: true };
    }

    default:
      return { error: "Method not allowed", status: 405 };
  }
}