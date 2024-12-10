<script lang="ts">
    import {
        Input,
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell, Button, Alert
    } from 'flowbite-svelte'
    import InfoCircleSolid from 'flowbite-svelte-icons/InfoCircleSolid.svelte'
    import TrashBinOutline from 'flowbite-svelte-icons/TrashBinOutline.svelte'
    import type {PageServerData} from "./$types";
    import {goto} from '$app/navigation';
    import {page} from '$app/stores';
    import Pagination from "$lib/components/Pagination.svelte";
    import {superForm} from "sveltekit-superforms";

    type Props = {
        data: PageServerData
    }

    let {data}: Props = $props();

    let {enhance}: { enhance: CallableFunction } = superForm(data.form);

    let searchTerm = $state(data.searchTerm);
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

    function updateQueryParameters(event: Event) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.value;
        const name = target.name;

        let query = new URLSearchParams($page.url.searchParams.toString());

        if (!value || value === "") {
            query.delete(name);
        } else {
            query.set(name, value);
        }

        if(query.has('page')) {
            query.set('page', '1');
        }
        goto(`?${query.toString()}`, {keepFocus: true});
    }

</script>


{#if message}
    <Alert dismissable onclose={()=>{message = ""}}>
        <InfoCircleSolid class="w-5 h-5"/>
        {message}
    </Alert>
{/if}

<div class="flex flex-start space-x-6">
    <div class="py-6 w-96">
        <Input
                type="text"
                name="search"
                placeholder="Rechercher un todo"
                value={searchTerm}
                oninput={updateQueryParameters}
        />
    </div>

    <form action="/create" class="py-6">
        <Button type="submit" color="green">Créer une todo</Button>
    </form>
    <form action="?/createFromFakeholder" method="POST" class="py-6" use:enhance>
        <Button type="submit" color="green" disabled>Créer 200 todos</Button>
    </form>
</div>

{#await data.filteredTodos then filteredTodos}

    {#if filteredTodos.total === 0}
        <div class="flex justify-center items-center h-96">
            <span class="text-2xl text-gray-400">Aucun todo trouvé</span>
        </div>
    {:else}
        <Table title="todos">
            <TableHead>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Priority</TableHeadCell>
                <TableHeadCell>Due Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell></TableHeadCell>
            </TableHead>
            <TableBody>
                {#each filteredTodos.items as _, index}
                    <TableBodyRow onclick={()=>{goto(`/${filteredTodos.items[index].id}`)}}>
                        <TableBodyCell>{filteredTodos.items[index].title}</TableBodyCell>
                        <TableBodyCell>
                            {#if filteredTodos.items[index].priority}
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium {priorityColors[filteredTodos.items[index].priority]}">
                            {filteredTodos.items[index].priority}
                            </span>
                            {/if}
                        </TableBodyCell>

                        <TableBodyCell>
                            {#if filteredTodos.items[index].dueDate}
                                {formatDate(filteredTodos.items[index].dueDate)}
                            {:else}
                                <span class="text-gray-400">No due date</span>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
						<span class="px-2.5 py-0.5 rounded-full text-xs font-medium {filteredTodos.items[index].completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
							{filteredTodos.items[index].completed ? "Completed" : "Pending"}
						</span>
                        </TableBodyCell>
                        <TableBodyCell tdClass="px-4 py-3 flex justify-end">
                            <form method="POST" action={`?/delete`} class="p-1" use:enhance>
                                <Input type="hidden" name="id" value={filteredTodos.items[index].id}/>
                                <Button color="red" class="p-1" on:click={(e)=> {e.stopPropagation()}} type="submit">
                                    <TrashBinOutline/>
                                </Button>
                            </form>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>

        <Pagination
                page={filteredTodos.page}
                total={filteredTodos.total}
                size={filteredTodos.size}
                pages={filteredTodos.pages}
        />
    {/if}
{/await}

