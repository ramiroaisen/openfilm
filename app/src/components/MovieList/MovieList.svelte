<script lang="ts">
  export let movies: Movie[];

  import type { Movie } from "../../types";
  import MovieItem from "./MovieItem.svelte";
</script>

<style>
  .movie-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0.75rem;
  }

  .item {
    flex-grow: 1;
    margin: 0.25rem;
  }
</style>

<div class="movie-list">
  {#each movies as movie}
    <div class="item">
      <MovieItem {movie} />
    </div>
  {/each}
</div>