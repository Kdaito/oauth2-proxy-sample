export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class TodoStore {
  private todos: Todo[] = [];
  private nextId = 1;

  getAll(): Todo[] {
    return [...this.todos];
  }

  getById(id: string): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  create(title: string): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.nextId.toString(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.nextId++;
    this.todos.push(todo);
    return todo;
  }

  update(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;

    if (updates.title !== undefined) todo.title = updates.title;
    if (updates.completed !== undefined) todo.completed = updates.completed;
    todo.updatedAt = new Date();

    return todo;
  }

  delete(id: string): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    return true;
  }
}

export const todoStore = new TodoStore();