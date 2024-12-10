<script lang="ts">
    import {type PageServerData} from "./$types"
    import Form from "$lib/components/Form.svelte";

    type Props = {
        data: PageServerData
    }

    let {data}: Props = $props();
</script>

{#await data.todo then todo}
    {#if todo}
        <Form
                id={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                priority={todo.priority}
                dueDate={todo.dueDate}
                form={data.form}
        />
    {/if}
{/await}