<script lang="ts">
    import {type PageServerData} from "./$types";
    import Form from "$lib/components/Form.svelte";

    type Props = {
        data: PageServerData
    }
    let {data}: Props = $props();
</script>


<Form form={data.form}/>
