<script lang="ts">
    import "../app.css"
    import {Heading} from "flowbite-svelte";

    let {children} = $props();
</script>

<main class="max-w-screen-lg mx-auto">
    <Heading tag="h1" class="text-2xl font-bold mb-4 text-center p-4">Todos</Heading>
    {@render children()}
</main>