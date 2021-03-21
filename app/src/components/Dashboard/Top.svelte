<script lang="ts">

  import {stores} from "sapper/app";
  import Ripple from "../Ripple.svelte";
  const {page} = stores(); 

</script>


<style>

  :global(body) {
    padding-top: 5rem;
  }

  .top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #fff;
    background: #141414;
    z-index: var(--z-top);
}

  .logo {
    color: #DC0813;
    font-weight: 900;
    font-size: 1.5rem;
    margin: 0 2rem;
    /*text-shadow: rgba(255,255,255,1) 0 0 2px;*/
  }

  .logo::first-letter {
    font-size: 1.2em;
  }

  .nav {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-self: stretch;
  }

  .nav > a {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-weight: 500;
  }

  .nav > a.current {
    background: rgba(255,255,255,0.1);  
  }

  .search-form {
    display: flex;
    flex: 1;
  }

  .search {
    flex: 1;
    margin: 0 2rem;
    background: rgba(255,255,255,0.75);
    border: 0;
    outline: 0;
    padding: 0.75rem;
    font: inherit;
    border-radius: 0.25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .search::placeholder {
    color: #444;
  }

</style>


<header class="top">
  <a href="./" class="na logo">
    OPENFILM
  </a>

  <nav class="nav">
    <a href="peliculas" class="na btn-light" class:current={$page.path.startsWith("/peliculas")}>
      Películas
      <Ripple />
    </a>
    <a href="series" class="na btn-light" class:current={$page.path.startsWith("/series")}>
      Series
      <Ripple />
    </a>
    <a href="categorias" class="na btn-light" class:current={$page.path.startsWith("/categorias")}>
      Categorías
      <Ripple />
    </a>
  </nav>

  <form class="search-form" action="/buscar" method="get">
    <input type="search" class="search" name="q" placeholder="Buscar...">
  </form>
</header>
