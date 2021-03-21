<script lang="ts">
    export let key: any;
</script>

{#each [0] as _ (key)}
    <slot/>
{/each}