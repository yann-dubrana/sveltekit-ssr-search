import type {Actions, PageServerLoad} from './$types';
import type {Todo} from '$lib/types';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
}


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

function filter(searchTerm: string | undefined): Todo[] {
    return searchTerm
        ? todos.filter(todo =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.dueDate?.toDateString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : todos;
}

export const load = (async ({url}) => {
    // Get search term from URL query parameter
    const searchTerm = url.searchParams.get('search') || '';

    // Filter todos if there's a search term
    const filteredTodos = filter(searchTerm);

    return {
        searchTerm,
        filteredTodos
    };
}) satisfies PageServerLoad;

export const actions = {
    searchTodos: async ({request}) => {
        const data = await request.formData();
        const search = data.get('search')?.toString() || '';

        // Filter todos based on search criteria
        let filteredTodos = filter(search);
        return {
            filteredTodos,
            searchTerm: search
        };
    }
} satisfies Actions;