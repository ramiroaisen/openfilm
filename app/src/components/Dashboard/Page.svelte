<script lang="ts">
  export let key: any = void 0;
  export let scrollable: boolean = false;

  import Keyed from "../Keyed.svelte";
  import {fly} from "svelte/transition";


</script>

<style>
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .scrollable {
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>

<Keyed {key}>
  <div class="page" class:scrollable in:fly={{duration: 300, x: -25}}>
    <slot />
  </div>
</Keyed>