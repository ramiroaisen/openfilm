<script lang="ts">
  export let paging: Paging<any>;
  export let id: (item: any) => any = item => item.id;
  export let loading = false;
  
  $: show = paging.items;
  $: next = paging.next;

  import type { Paging } from "../types";
  import { intersect } from "../actions" 
  import { getNotifier } from "./Notify/notify";

  const loadmore = async () => {
    if(loading || !next) return;
    loading = true;
    const json = await fetch(next).then(res => res.json());
    if(json.error) return getNotifier().error(`Hubo un error cargando más elementos: ${json.error.message}`)
    show = [...show, ...json.page.items];
    next = json.page.next;
    loading = false;
  }

  $: console.log(loading, next)
</script>

<style>
  .placeholder {
    height: 1px;
    flex: none;
  }
</style>

{#each show as item, i (id(item))}
  <slot {item} {i}></slot>
{/each}
{#if !loading && next}
  <div class="placeholder" use:intersect on:enter-screen={loadmore} />
{/if}