import type {Actions, PageServerLoad} from './$types';
import type {Todo} from '$lib/types';

const generateTodos = (): Todo[] => {
    return Array.from({length: 20}, (_, i) => ({
        id: i + 1,
        title: `Todo Item ${i + 1}`,
        description: `Description for todo item ${i + 1}`,
        completed: Math.random() > 0.5,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Todo['priority'],
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
};

const todos = generateTodos();

export const load = (async () => {
    return {
        todos
    };
}) satisfies PageServerLoad;

export const actions = {
    searchTodos: async ({request}) => {
        const data = await request.formData();
        const search = data.get('search')?.toString() || '';

        // Filter todos based on search criteria
        let filteredTodos = todos.filter(todo =>
            todo.title.toLowerCase().includes(search.toLowerCase()) ||
            todo.description.toLowerCase().includes(search.toLowerCase())
        );

        return {
            filteredTodos
        };
    }
} satisfies Actions;