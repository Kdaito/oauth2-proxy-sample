import { useState } from "react";
import { useFetcher } from "react-router";
import type { Todo } from "~/lib/todo-store";
import { todoStore } from "~/lib/todo-store";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TODO List - OAuth2 Proxy Sample" },
    { name: "description", content: "Simple TODO list with CRUD operations" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const todos = todoStore.getAll();
  return todos;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const todos = loaderData as unknown as Todo[];
  const addFetcher = useFetcher();
  const updateFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const handleDelete = (id: string) => {
    if (!confirm("このTODOを削除しますか？")) return;
    deleteFetcher.submit({ id }, { method: "DELETE", action: "/api/todos" });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>TODO List</h1>

      <addFetcher.Form
        method="post"
        action="/api/todos"
        style={{ marginBottom: "20px" }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            name="title"
            placeholder="新しいTODOを入力"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
          <button
            type="submit"
            disabled={addFetcher.state !== "idle"}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: addFetcher.state !== "idle" ? 0.6 : 1,
            }}
          >
            {addFetcher.state !== "idle" ? "追加中..." : "追加"}
          </button>
        </div>
      </addFetcher.Form>

      <div>
        {todos.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center", marginTop: "40px" }}>
            TODOがありません。上から追加してください。
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  backgroundColor: todo.completed ? "#f8f9fa" : "white",
                }}
              >
                <updateFetcher.Form
                  method="put"
                  action="/api/todos"
                  style={{ display: "contents" }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={(!todo.completed).toString()}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      style={{ cursor: "pointer" }}
                    />
                  </button>
                </updateFetcher.Form>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#666" : "inherit",
                    }}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    disabled={deleteFetcher.state !== "idle"}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontSize: "12px",
                      opacity: deleteFetcher.state !== "idle" ? 0.6 : 1,
                    }}
                  >
                    {deleteFetcher.state !== "idle" ? "削除中..." : "削除"}
                  </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
