<script lang="ts">
</script>

<style>
  form {
    border-top: var(--violet) 3px solid;
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 400px;
    max-width: 95%;
    margin: 0 auto;
    flex: none;
  }
</style>

<form class="elev3" on:submit|preventDefault>
  <slot />
</form>