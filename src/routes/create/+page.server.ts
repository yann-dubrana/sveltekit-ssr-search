import type {PageServerLoad} from './$types';
import {fail, superValidate} from "sveltekit-superforms";
import {zod} from "sveltekit-superforms/adapters";
import type {Actions} from "@sveltejs/kit";
import {TodoCreateSchema} from "$lib/validation.server";
import {todoService} from "$lib/todos.server";

export const load = (async () => {
    return {
        form: superValidate(zod(TodoCreateSchema)),
    }
}) satisfies PageServerLoad;

export const actions: Actions = {

    default: async ({request}) => {

        const form = await superValidate(request, zod(TodoCreateSchema));
        if (!form.valid) {
            return fail(400, {form});
        }

        await todoService.add({
            title: form.data.title,
            description: form.data.description,
            completed: form.data.completed,
            priority: form.data.priority,
            dueDate: form.data.dueDate
        })

        return {
            form
        };
    }
}
