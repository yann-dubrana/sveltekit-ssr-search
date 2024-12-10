<script lang="ts">
    import {Label, Input, Textarea, Select, Datepicker, P, Button, Helper} from 'flowbite-svelte';
    import {superForm} from "sveltekit-superforms";
    import {afterNavigate, goto} from "$app/navigation";
    import {base} from "$app/paths";

    type Props = {
        id?: number | undefined;
        title?: string;
        description?: string | null;
        completed?: boolean;
        priority?: string;
        dueDate?: Date | null;
        form: any;
    }

    let {
        id = undefined,
        title = "",
        description = "",
        completed = false,
        priority = 'low',
        dueDate = new Date(),
        form
    }: Props = $props();

    const completeItems = $state([{value: false, name: 'No'}, {value: true, name: 'Yes'}]);

    const priorityItems = $state([{value: 'low', name: 'Low'}, {value: 'medium', name: 'Medium'}, {
        value: 'high',
        name: 'High'
    }]);

    let previousPage: string = $state(base);
    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage
        let query = from?.url.searchParams.toString()
        if (!query) {
            return
        }
        previousPage = previousPage + "?" + query
    })

    let {errors, enhance}: { errors: any, enhance: CallableFunction } = superForm(form, {
        onUpdated({form}) {
            if (form.valid) {
                goto(previousPage)
            }
        }
    });
</script>

<form method="POST" class="space-y-6 w-1/2 mx-auto" use:enhance>

    {#if id}
        <Input type="hidden" name="id" value={id}/>
    {/if}

    <div>
        <Label for="title">Title</Label>
        <Input
                type="text"
                id="title"
                name="title"
                color={$errors.title ? 'red' : undefined}
                bind:value={title}
        />
        {#if $errors.title}
            <Helper class='mt-2' color='red'>
                    <span class="font-medium">
                        {$errors.title.join(" ")}
                    </span>
            </Helper>
        {/if}
    </div>

    <div>
        <Label for="description">Description</Label>
        <Textarea
                id="description"
                name="description"
                color={$errors.description ? 'red' : undefined}
                bind:value={description}
        />
        {#if $errors.description}
            <Helper class='mt-2' color='red'>
                    <span class="font-medium">
                        {$errors.description.join(" ")}
                    </span>
            </Helper>
        {/if}
    </div>
    <div>
        <Label for="completed">Completed</Label>
        <Select id="completed" name="completed" items={completeItems} bind:value={completed}/>
    </div>

    <!-- Priority -->
    <div>
        <Label for="priority">Priority</Label>
        <Select id="priority" name="priority" items={priorityItems} bind:value={priority}/>
    </div>

    <div>
        <Label for="dueDate">Due Date</Label>
        <Input type="hidden" name="dueDate" value={dueDate}/>
        <Datepicker bind:value={dueDate}/>
    </div>

    <!-- Submit Button -->
    <Button type="submit" class="float-end">{id ? "Update" : "Create"} Todo</Button>
</form>