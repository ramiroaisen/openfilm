<script lang="ts">
import { getContext, onMount } from "svelte";

  type Nullable<T> = T | undefined;

  export let value: number;
  //export let placeholder = "";
  export let label: Nullable<string> = void 0;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let id: Nullable<string> = void 0;
  export let name: Nullable<string> = void 0;
  export let step: Nullable<number> = void 0;
  export let max: Nullable<number> = void 0;
  export let min: Nullable<number> = void 0;

  export let multiline: boolean = false;
  
  export let link: string | undefined = void 0;
  export let external: string | undefined = void 0;

  export let validate: boolean = false;
  export let required: boolean = false;

  export let validationError: string | null = null;

  export const doValidate = () => {
    if(!validate) {
      validationError = "";
      return true;
    }

    if(typeof value !== "number" || Number.isNaN(value)) {
      validationError = "Este campo tiene que ser un número";
      return false;
    } 

    if(required  && value == null) {
      validationError = "Este campo es requerido";
      return false;
    }

    return true;
  }

  const formy = getContext("formy") as Context | undefined;
  onMount(() => formy && formy.register(doValidate));

  import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
  import OpenInNew from "svelte-material-icons/OpenInNew.svelte";
  import type { Context } from "./Formy/Formy.svelte";
import ValidationError from "./Formy/ValidationError.svelte";
  import Ripple from "./Ripple.svelte";
</script>

<style>
  .text-field {
    position: relative;
    display: flex;
  }

  input {
    flex: none;
    font: inherit;
    box-sizing: content-box;
    outline: none;
    flex: 1;
    margin: 0;
    border: 1px rgba(0, 0, 0, 0.23) solid;
    border-radius: 3px;
    padding: 0.9em 0.75em;
    width: 100%;
    color: inherit;
    transition: border-color 150ms ease-in-out;
    background-color: #fff;
  }

  input:disabled {
    color: rgba(0, 0, 0, 0.5);
  }

  input:focus {
    border-color: var(--violet);
  }

  .label {
    position: absolute;
    top: calc(2px + 0.9em);
    left: calc(1px + 0.75em);
    padding: 0 0.4em;
    margin: 0 -0.4em;
    pointer-events: none;
    background: #fff;
    color: rgba(0, 0, 0, 0.5);
    transition: color 150ms ease, transform 150ms ease-in-out;
    transform-origin: top left;
    max-width: calc(100% - 1em);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-field:not(.empty) > .label,
  input:focus + .label {
    transform: scale(0.7) translateY(-165%);
  }

  input:focus + .label{
    color: var(--violet);
  }

  .link {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .with-link > input {
    padding-inline-end: 2.75rem;
  }
</style>

<div
  class="text-field"
  class:empty={value == null}
  class:disabled
  class:readonly
  class:multiline
  class:with-link={link || external}>
  <input
    {id}
    {name}
    type="number"
    {step}
    {max}
    {min}
    bind:value
    {readonly}
    {disabled}
    on:input
    on:focus
    on:focus={() => validationError = null}
    on:blur
    on:change
    on:keypress
    on:keydown
    on:keyup />
  {#if label != null}
    <span class="label">{label}</span>
  {/if}

  {#if link != null}
    <a class="na link btn-dark" href={link}>
      <ArrowRight />
      <Ripple/>
    </a>
  {:else if external != null}
    <a class="na link btn-dark" rel="nofollow nopener" target="_blank" href={external}>
      <OpenInNew />
      <Ripple/>
    </a>
  {/if}

  {#if validationError != null}
    <ValidationError message={validationError} />
  {/if}
</div>
