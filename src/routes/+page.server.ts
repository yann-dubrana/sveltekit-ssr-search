import type {Actions, PageServerLoad} from './$types';
import {todoService} from "$lib/todos.server";

export const load = (async ({url}) => {
    const searchTerm = url.searchParams.get('search') || '';
    const filteredTodos = await todoService.getFiltered(searchTerm);

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
        const filteredTodos = await todoService.getFiltered(search);
        return {
            filteredTodos,
            searchTerm: search
        };
    },
    createFromFakeholder: async () => {
        await todoService.createFromFakeHolder();
        return {
            message: 'Todos created from fakeholder'
        };
    }

} satisfies Actions;