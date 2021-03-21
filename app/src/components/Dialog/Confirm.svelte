<script lang="ts">
  import Ripple from "../Ripple.svelte";
  import Dialog from "./Dialog.svelte";

  export let title: string;

  export let onConfirm: () => void;
  export let onCancel: () => void;

  export let confirm = "Confirmar";
  export let cancel = "Cancelar";

</script>

<style>
  .title {
    background: rgba(0,0,0,0.075);
    border-bottom: rgba(0,0,0,0.18);
    padding: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }

  .message {
    padding: 2rem;
  }

  .btns {
    padding: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: row;
  }

  .btn + .btn {
    margin-inline-start: auto;
  }

  .btn {
    text-transform: uppercase;
    font-weight: 0.9rem;
    padding: 0.75rem;
    border-radius: 0.25rem;
  }
</style>

<Dialog onClose={onCancel}>
  <div class="title">{title}</div>
  <div class="message">
    <slot />
  </div>
  <div class="btns">
    <div class="btn btn-dark confirm" on:click={onCancel}>
      {cancel}
      <Ripple />
    </div>

    <div class="btn btn-dark confirm" on:click={onConfirm}>
      {confirm}
      <Ripple />
    </div>
  </div>
</Dialog>