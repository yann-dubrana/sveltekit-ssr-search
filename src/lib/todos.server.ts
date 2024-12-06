import {PrismaClient} from '@prisma/client';
import {type Todo} from '@prisma/client'
export const db = new PrismaClient();

class TodoService {
    async get(): Promise<Todo[]> {
        return db.todo.findMany();
    }

    async getById(id: number): Promise<Todo | null> {
        return db.todo.findUnique({
            where: {id}
        });
    }

    async add(todo: Omit<Todo, 'id'>): Promise<Todo> {
        return db.todo.create({
            data: {
                title: todo.title,
                description: todo.description,
                completed: todo.completed,
                priority: todo.priority,
                dueDate: todo.dueDate
            }
        });
    }

    async update(id: number, todo: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
        return db.todo.update({
            where: {id},
            data: {
                title: todo.title,
                description: todo.description,
                completed: todo.completed,
                priority: todo.priority,
                dueDate: todo.dueDate
            }
        });
    }

    async remove(id: number): Promise<void> {
        await db.todo.delete({
            where: {id}
        });
    }

    async getByPriority(priority: Todo['priority']): Promise<Todo[]> {
        return db.todo.findMany({
            where: {priority}
        });
    }

    async getCompletedTodos(): Promise<Todo[]> {
        return db.todo.findMany({
            where: {completed: true}
        });
    }

    async getOverdueTodos(): Promise<Todo[]> {
        return db.todo.findMany({
            where: {
                completed: false,
                dueDate: {
                    lt: new Date()
                }
            }
        });
    }

    async getFiltered(searchTerm?: string): Promise<Todo[]> {
        if (!searchTerm) {
            return await this.get();
        }

        return db.todo.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                        }
                    },
                    {
                        priority: {
                            contains: searchTerm,
                        }
                    },
                ]
            }
        });
    }

    async createFromFakeHolder(): Promise<void> {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const todos = await response.json();

        for (const todo of todos) {
            // Generate random priority
            const priorities: Todo['priority'][] = ['low', 'medium', 'high'];
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

            // Generate random due date within the last month
            const currentDate = new Date();
            const lastMonthDate = new Date(currentDate);
            lastMonthDate.setMonth(currentDate.getMonth() - 1);

            const randomDueDate = new Date(
                lastMonthDate.getTime() +
                Math.random() * (currentDate.getTime() - lastMonthDate.getTime())
            );

            await todoService.add({
                title: todo.title,
                description: todo.title,
                completed: todo.completed,
                priority: randomPriority,
                dueDate: randomDueDate
            });
        }
    }
}

export const todoService: TodoService = new TodoService();