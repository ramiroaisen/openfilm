<script lang="ts" context="module">
  import { ApiMap } from "../util";
  export const preload = ApiMap();
</script>

<script lang="ts">
  export let sample: Movie[];

  import Page from "../components/Dashboard/Page.svelte";
  import type { Movie } from "../types";
  import MovieList from "../components/MovieList/MovieList.svelte";
</script>

<style>
</style>

<Page>
  <MovieList movies={sample} />
</Page>