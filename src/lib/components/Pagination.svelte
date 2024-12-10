<script lang="ts">

    import {Button, ButtonGroup} from "flowbite-svelte";
    import ChevronLeftOutline from "flowbite-svelte-icons/ChevronLeftOutline.svelte";
    import ChevronRightOutline from "flowbite-svelte-icons/ChevronRightOutline.svelte";
    import ChevronDoubleLeftOutline from "flowbite-svelte-icons/ChevronDoubleLeftOutline.svelte";
    import ChevronDoubleRightOutline from "flowbite-svelte-icons/ChevronDoubleRightOutline.svelte";

    import {Pagination} from "$lib/pagination.svelte";

    type Props = {
        page: number,
        total: number,
        size: number,
        pages: number
    }

    let {page, total, size, pages}: Props = $props();
    let pagination = new Pagination(total,page, size, pages);
</script>

<div
        class="flex flex-col md:flex-row justify-between  space-y-3 md:space-y-0 p-4 grow items-end"
        aria-label="Table navigation">

          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">{pagination.startRange}
                -{pagination.endRange}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{pagination.total}</span>
          </span>
    <ButtonGroup>
        <Button onclick={(e)=>{e.preventDefault(); pagination.loadFirst()}}
                disabled={pagination.page === 1}>
            <ChevronDoubleLeftOutline size='xs' class='m-1.5'/>
        </Button>
        <Button onclick={(e)=>{e.preventDefault(); pagination.loadPrevious()}}
                disabled={pagination.page === 1}>
            <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each pagination.pagesToShow as pageNumber}
            <Button onclick={(e)=>{e.preventDefault(); pagination.goTo(pageNumber)}}>{pageNumber}</Button>
        {/each}
        <Button onclick={(e)=>{e.preventDefault(); pagination.loadNext()}}
                disabled={ pagination.page === pagination.pages }>
            <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
        <Button onclick={(e)=>{e.preventDefault(); pagination.loadLast()}}
                disabled={ pagination.page === pagination.pages }>
            <ChevronDoubleRightOutline size='xs' class='m-1.5'/>
        </Button>
    </ButtonGroup>
</div>