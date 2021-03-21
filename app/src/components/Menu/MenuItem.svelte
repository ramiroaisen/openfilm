<script lang="ts">
  import type SvelteComponent from "svelte-material-icons/Check.svelte";
  export let icon: typeof SvelteComponent | undefined = void 0;
  export let href: string | undefined = void 0;
  export let iconPlaceholder: boolean = false;
  export let target: string | undefined = void 0;
  import Ripple from "../Ripple.svelte";
</script>

<style>
  .menu-item {
    display: flex;
    flex-direction: row;
    min-height: 2.5em;
    align-items: center;
    color: #333;
    padding-inline-end: 1em;
  }

  .noplaceholder {
    padding-inline-start: 1em;
  }

  .icon {
    flex: none;
    width: 2.5em;
    height: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon > :global(svg) {
    font-size: 1.25em;
  }
</style>

<a
  class="menu-item na btn-dark"
  class:noplaceholder={!icon && !iconPlaceholder}
  {href}
  {target}
  on:click
  on:pointerdown>
  {#if icon || iconPlaceholder}
    <div class="icon">
      {#if icon}
        <svelte:component this={icon} />
      {/if}
    </div>
  {/if}
  <slot />
  <Ripple />
</a>
