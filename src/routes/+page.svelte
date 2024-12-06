<script lang="ts">
    import {
        Heading,
        Input,
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell, Button, Alert
    } from 'flowbite-svelte'
    import {InfoCircleSolid} from 'flowbite-svelte-icons'
    import {enhance} from '$app/forms'
    import {invalidate} from "$app/navigation";

    let {data} = $props();

    let searchTerm = $state(data.searchTerm);
    let filteredTodos = $state(data.filteredTodos);
    let message = $state("");

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

    function updateUrlWithSearchQuery(searchQuery: string) {
        const url = new URL(window.location.href);
        if (searchQuery.trim() === "") {
            url.searchParams.delete('search');
        } else {
            url.searchParams.set('search', searchQuery);
        }
        window.history.pushState({}, '', url);
    }

    function validateResult() {
        return ({result}) => {
            if (result.type === "success") {
                filteredTodos = result.data.filteredTodos;
                updateUrlWithSearchQuery(searchTerm);
                return
            }
        }
    }

    function showSuccessMessage(message: string) {
        return ({result}) => {
            if (result.type === "success" && result.data.message) {
                message = result.data.message;
                invalidate("/")
            }
        }
    }
</script>

<main class="max-w-screen-lg mx-auto">
    <Heading tag="h1" class="text-2xl font-bold mb-4 text-center p-4">Recherche SSR Todos</Heading>

    {#if message}
        <Alert dismissable on:close={()=>{message = ""}}>
            <InfoCircleSolid slot="icon" class="w-5 h-5"/>
            {message}
        </Alert>
    {/if}

    <div class="flex justify-between">
        <form action="?/searchTodos" method="POST" class="py-6 w-96" use:enhance={validateResult}>
            <Input type="text" name="search" placeholder="Rechercher un todo" oninput={submitForm}
                   bind:value={searchTerm}
                   class="w-full p-2 border border-gray-300 rounded-lg"/>
        </form>

        <form action="?/createFromFakeholder" method="POST" class="p-6" use:enhance>
            <Button type="submit" color="green" disabled>Créer 200 todos</Button>
        </form>
    </div>


    <Table title="todos">
        <TableHead>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Priority</TableHeadCell>
            <TableHeadCell>Due Date</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each filteredTodos as todo}
                <TableBodyRow>
                    <TableBodyCell>{todo.title}</TableBodyCell>
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