<script lang="ts">
  export let onClose: (() => void) = () => {};
  export let showCloseButton: boolean = false;
  export let expand: boolean = false;
  import {fade} from "svelte/transition";
  import Close from "svelte-material-icons/Close.svelte";
  import Ripple from "../Ripple.svelte";
</script>

<style>
  .overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    z-index: var(--z-dialog-overlay);
  }

  .dialog {
    position: relative;
    background: #fff;
    display: flex;
    flex-direction: column;
    width: 500px;
    max-width: 90%;
    align-self: center;
    justify-self: center;                   
    /*overflow: hidden;*/
    border-radius: 0.25rem;
  }

  .dialog.expand {
    width: 90%;
    height: 90%;
    overflow: auto;
  }

  .close {
    position: absolute;
    font-size: 2rem;
    padding: 0.5rem;
    top: -1rem;
    right: -1rem;
    background: #000;
    color: #fff;
    border-radius: 50%;
    border: 2px #fff solid;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0,0,0,0.5) 2px solid;
    z-index: 10000;
  }
</style>

<div class="overlay" transition:fade|local={{duration: 300}} on:click={onClose}>
  <div class="dialog elev3" class:expand on:click|stopPropagation={() => {}}>
    {#if showCloseButton}
      <div class="btn-light close" on:click={onClose}>
        <Close />
        <Ripple />
      </div>
    {/if}
    <slot />    
  </div>
</div>
