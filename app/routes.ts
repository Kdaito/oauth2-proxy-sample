import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),

  route("api/todos", "./routes/api.todos.ts"),
] satisfies RouteConfig;
