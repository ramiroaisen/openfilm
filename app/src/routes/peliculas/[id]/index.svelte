<script lang="ts" context="module">
  import { ApiMap } from "../../../util";
  export const preload = ApiMap();
</script>

<script lang="ts">
  export let movie: Movie;
  export let categories: Category[];

  $: sortedStreams = movie.streams.slice().sort((a, b) => {
    return a.type.localeCompare(b.type) || a.provider.localeCompare(b.provider);
  })

  $: console.log(sortedStreams);

  $: selectedStream = sortedStreams[0];

  let iframe: HTMLIFrameElement;

  $: selectedStream && iframe && (iframe.src = selectedStream.url);

  import type { Movie, Category } from "../../../types";
  import Page from "../../../components/Dashboard/Page.svelte";
  import StreamSelector from "../../../components/Video/StreamSelector.svelte";
</script>

<style>
  
  .w1000 {
    margin: 0 auto;
    width: 1000px;
    max-width: 95%;
  }

  .main {
    display: flex;
    flex-direction: row;
    padding: 1rem;
  }

  .img {
    flex: none;
    width: 25%;
    padding-top: calc(25% * 1.472);
    border-radius: 0.5rem;
    margin-inline-end: 2rem;
  }

  .label {
    color: rgba(255,255,255,0.75);
  }

  .description {
    margin-top: 1.5rem;
  }
  
  h1 {
    margin-top: 0;
  }

  .video {
    position: relative;
    width: 100%;
    padding-top: calc(100% * 9 / 16);
    max-height: calc(90% - 5rem);
    display: flex;
  }

  iframe {
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  } 
</style>

<Page key={movie.id}>
  <main class="main w1000">
    <div
      class="img cover"
      style="background-image: url({movie.listImageUrl})" />
    <div class="data">
      <h1>{movie.name}</h1>
      <div class="year"><span class="label">Año:</span> {movie.year}</div>
      {#if categories.length}
        <div class="categories">
          {#each categories as category}
            <a class="na category" href="categoria/{category.slug}">
              {category.name}
            </a>
          {/each}
        </div>
      {/if}
      <div class="description">{movie.description}</div>
    </div>
  </main>

  <div class="stream-selector w1000">
    <StreamSelector streams={sortedStreams} bind:selected={selectedStream} />
  </div>

  <div class="w1000">
    <div class="video w1000">
      {#if selectedStream != null}
        <iframe title="video" allowfullscreen src={selectedStream.url} />
      {/if}
    </div>
  </div>
</Page>
