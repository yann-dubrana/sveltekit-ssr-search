<script lang="ts">

    import {Button, ButtonGroup} from "flowbite-svelte";
    import ChevronLeftOutline from "flowbite-svelte-icons/ChevronLeftOutline.svelte";
    import ChevronRightOutline from "flowbite-svelte-icons/ChevronRightOutline.svelte";
    import ChevronDoubleLeftOutline from "flowbite-svelte-icons/ChevronDoubleLeftOutline.svelte";
    import ChevronDoubleRightOutline from "flowbite-svelte-icons/ChevronDoubleRightOutline.svelte";

    import {page as currentPage} from "$app/stores";
    import {goto} from "$app/navigation";

    type Props = {
        page: number,
        total: number,
        size: number,
        pages: number
    }
    const SHOW_X_PAGES = 5

    let {page, total, size, pages}: Props = $props();
    let startRange: number = $derived((page > 1) ? (page - 1) * size + 1 : page)
    let endRange: number = $derived((page > 1) ? Math.min((page - 1) * size + size, total) : Math.min(page * size, total))

    let startPage: number = $derived(Math.max(1, page - Math.floor(SHOW_X_PAGES / 2)))
    let endPage: number = $derived(Math.min(startPage + SHOW_X_PAGES - 1, pages))
    let pagesToShow: number[] = $derived(Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i))

    let query: URLSearchParams | undefined = $derived.by(() => {
        if ($currentPage === undefined) {
            return undefined
        }
        return new URLSearchParams($currentPage.url.searchParams.toString())
    })

    function load() {

        if (!$currentPage || !query) {
            return
        }

        query.set('page', page.toString());
        query.set('size', size.toString());
        goto(`?${query.toString()}`, {});

    }

    function loadFirst() {
        page = 1
        load()
    }

    function loadLast() {
        page = pages
        load()
    }

    function loadNext() {
        if (page + size < total) {
            page += 1
            load()
        }
    }

    function loadPrevious() {
        if (endRange - size >= 0) {
            page -= 1;
            load()
        }
    }

    function goTo(p: number) {
        page = p
        load()
    }

    $effect(() => {
        if (!query || !query.get('page') || pages === 0) {
            return
        }

        if (parseInt(query.get('page') || "1") > pages) {
            query.set('page', pages.toString());
            goto(`?${query.toString()}`, {keepFocus: true});
        }
    })
</script>

<div
        class="flex flex-col md:flex-row justify-between  space-y-3 md:space-y-0 p-4 grow items-end"
        aria-label="Table navigation">

          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">{startRange}
                -{endRange}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{total}</span>
          </span>
    <ButtonGroup>
        <Button onclick={(e: Event)=>{e.preventDefault(); loadFirst()}}
                disabled={page === 1}>
            <ChevronDoubleLeftOutline size='xs' class='m-1.5'/>
        </Button>
        <Button onclick={(e: Event)=>{e.preventDefault(); loadPrevious()}}
                disabled={page === 1}>
            <ChevronLeftOutline size='xs' class='m-1.5'/>
        </Button>
        {#each pagesToShow as pageNumber}
            <Button onclick={(e: Event)=>{e.preventDefault(); goTo(pageNumber)}}>{pageNumber}</Button>
        {/each}
        <Button onclick={(e: Event)=>{e.preventDefault(); loadNext()}}
                disabled={ page === pages }>
            <ChevronRightOutline size='xs' class='m-1.5'/>
        </Button>
        <Button onclick={(e: Event)=>{e.preventDefault(); loadLast()}}
                disabled={ page === pages }>
            <ChevronDoubleRightOutline size='xs' class='m-1.5'/>
        </Button>
    </ButtonGroup>
</div>