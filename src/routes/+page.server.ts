import type {Actions, PageServerLoad} from './$types';
import {todoService} from "$lib/todos.server";
import {fail, superForm, superValidate} from "sveltekit-superforms";
import {zod} from "sveltekit-superforms/adapters";
import {TodoCreateSchema, TodoDeleteSchema} from "$lib/validation.server";

export const load = (async ({url}) => {

    const searchTerm = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '10');

    return {
        searchTerm,
        form: await superValidate(zod(TodoDeleteSchema)),
        filteredTodos: todoService.getFiltered(searchTerm, page, size)
    };
}) satisfies PageServerLoad;

export const actions = {
    createFromFakeholder: async () => {
        await todoService.createFromFakeHolder();
        return {
            message: 'Todos created from fakeholder'
        };
    },
    delete: async ({request}) => {
        const form = await superValidate(request, zod(TodoDeleteSchema));
        if (!form.valid) {
            return fail(400, {form});
        }

        await todoService.remove(form.data.id);

        return {
            form
        };
    }

} satisfies Actions;