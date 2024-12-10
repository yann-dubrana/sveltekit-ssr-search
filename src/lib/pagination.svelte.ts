import {page} from "$app/stores";
import type {Page} from "@sveltejs/kit";
import {goto} from "$app/navigation";

const SHOW_X_PAGES = 5

class Pagination {
    total: number = $state(0);
    page: number = $state(0);
    size: number = $state(0);
    pages: number = $state(0);

    currentPage: Page<Record<string, string>, string | null> | undefined;
    startRange: number = $derived((this.page > 1) ? (this.page - 1) * this.size + 1 : this.page)
    endRange: number = $derived((this.page > 1) ? Math.min((this.page - 1) * this.size + this.size, this.total) : Math.min(this.page * this.size, this.total))

    startPage: number = $derived(Math.max(1, this.page - Math.floor(SHOW_X_PAGES / 2)))
    endPage: number = $derived(Math.min(this.startPage + SHOW_X_PAGES - 1, this.pages))
    pagesToShow: number[] = $derived(Array.from({length: this.endPage - this.startPage + 1}, (_, i) => this.startPage + i))

    query: URLSearchParams | undefined = $derived.by(() => {
        if (this.currentPage === undefined) {
            return undefined
        }
        return new URLSearchParams(this.currentPage.url.searchParams.toString())
    })

    constructor(total: number, _page: number, size: number, pages: number) {
        this.total = total
        this.page = _page
        this.size = size
        this.pages = pages

        page.subscribe((v) => {
            this.currentPage = v
        })

        if (!this.query || !this.query.get('page') || this.pages === 0) {
            return
        }

        if (parseInt(this.query.get('page') || "1") > this.pages) {
            this.query.set('page', this.pages.toString());
            goto(`?${this.query.toString()}`, {keepFocus: true});
        }
    }


    load = () => {

        if (!this.currentPage || !this.query) {
            return
        }

        this.query.set('page', this.page.toString());
        this.query.set('size', this.size.toString());
        goto(`?${this.query.toString()}`, {});

    }

    loadFirst() {
        this.page = 1
        this.load()
    }

    loadLast = () => {
        this.page = this.pages
        this.load()
    }

    loadNext = () => {
        if (this.page + this.size < this.total) {
            this.page += 1
            this.load()
        }
    }

    loadPrevious = () => {
        if (this.endRange - this.size >= 0) {
            this.page -= 1;
            this.load()
        }
    }

    goTo = (page: number) => {
        this.page = page
        this.load()
    }


}

export {Pagination}