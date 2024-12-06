<script lang="ts">
    import {
        Heading,
        Input,
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell
    } from 'flowbite-svelte'
    import {enhance} from '$app/forms'

    let {data} = $props();

    let filteredTodos = $state(data.todos);

    // Priority badge colors
    const priorityColors = $state({
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    });

    /** Format date to local string */
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    function submitForm(event: Event) {
        if (!event || !event.target || !(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) || !event.target.form) {
            return;
        }
        event.target.form.requestSubmit();
    }

    function validateResult() {
        return ({result}) => {
            if (result.type === "success") {
                console.log(result);
                filteredTodos = result.data.filteredTodos;
                return
            }
        }
    }
</script>

<main class="max-w-screen-lg mx-auto">
    <Heading tag="h1" class="text-2xl font-bold mb-4 text-center p-4">Recherche SSR Todos</Heading>

    <form action="?/searchTodos" method="POST" class="p-6" use:enhance={validateResult}>
        <Input type="text" name="search" placeholder="Rechercher un todo" oninput={submitForm}
               class="w-full p-2 border border-gray-300 rounded-lg"/>
    </form>

    <Table title="todos">
        <TableHead>

            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>Priority</TableHeadCell>
            <TableHeadCell>Due Date</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each filteredTodos as todo}
                <TableBodyRow>
                    <TableBodyCell>{todo.title}</TableBodyCell>
                    <TableBodyCell>{todo.description}</TableBodyCell>
                    <TableBodyCell>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {priorityColors[todo.priority]}">
                        {todo.priority}
                        </span>
                    </TableBodyCell>
                    <TableBodyCell>{formatDate(todo.dueDate)}</TableBodyCell>
                    <TableBodyCell>
						<span class="px-2.5 py-0.5 rounded-full text-xs font-medium {todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
							{todo.completed ? "Completed" : "Pending"}
						</span>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>