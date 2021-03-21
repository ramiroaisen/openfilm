<script lang="ts">
  export let streams: Movie["streams"];
  export let selected: Movie["streams"][number] | undefined = streams[0];

  $: console.log(selected);

  import type { Movie } from "../../types";
  import Ripple from "../Ripple.svelte";

  $: mapped = ((streams: Movie["streams"]) => {

    const types: string[] = [];
    for(const stream of streams) {
      if(!types.includes(stream.type)) {
        types.push(stream.type);
      }
    }

    const mapped = types.map(type => {
      const _streams = streams.filter(stream => stream.type === type);
      return {
        type,
        streams: _streams
      }
    })

    return mapped;
  })(streams);
</script>

<style>
  .stream-selector {
    display: flex;
    flex-direction: row;
  }

  .group-type {
    text-transform: capitalize;
    font-weight: 700;
  }

  .stream {
    padding: 0.5rem;
  }
</style>

<div class="stream-selector">
  {#each mapped as {type, streams}}
    <div class="group">
      <div class="group-type">{type}</div>
      <div class="stream-list">
        {#each streams as stream}
          <div class="btn-light stream" class:hover={selected === stream} on:click={() => selected = stream}>
            {stream.type} - {stream.provider}
            <Ripple /> 
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>