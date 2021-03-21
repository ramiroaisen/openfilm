<script lang="ts">
  import { getContext } from "svelte";

  import type { Writable } from "svelte/store";
  const { drawerFixed, drawerOpen } = getContext("dash") as {drawerFixed: Writable<boolean>, drawerOpen: Writable<boolean>};
  $: fixed = $drawerFixed;
  $: open = $drawerOpen;

  import { fade } from "svelte/transition";
  import Ripple from "../Ripple.svelte";

  import { stores } from "sapper/app";

  import Menu from "svelte-material-icons/Menu.svelte";

  const { page, session } = stores();

  const click = (event: MouseEvent) => {
    if ($drawerFixed) {
      let target = event.target;
      while (target) {
        if ((target as Element).nodeName.toLowerCase() === "a") {
          $drawerOpen = false;
          return;
        }
        target = (target as Element).parentElement;
      }
    }
  };

  import Home from "svelte-material-icons/HomeOutline.svelte";
  import News from "svelte-material-icons/NewspaperVariantOutline.svelte";
  import Events from "svelte-material-icons/CalendarCheck.svelte";
  import SpecialEvents from "svelte-material-icons/CalendarHeart.svelte";
  import Mailing from "svelte-material-icons/EmailMultipleOutline.svelte";
  import Admin from "svelte-material-icons/AccountCashOutline.svelte";
  import Recruiting from "svelte-material-icons/AccountGroupOutline.svelte";
  import Travel from "svelte-material-icons/AirplaneTakeoff.svelte";
  import Image from "svelte-material-icons/Image.svelte";
  import Zip from "svelte-material-icons/ZipBoxOutline.svelte";
  import Task from "svelte-material-icons/CalendarCheckOutline.svelte";
  import Templates from "svelte-material-icons/FileDocumentEditOutline.svelte";
</script>

<style>
  .drawer {
    border-right: var(--border-gray) 1px solid;
    box-sizing: border-box;
    flex: none;
    align-self: stretch;
    width: 16rem;
    transition: margin 350ms ease;
    background: #fff;
    z-index: var(--z-drawer);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .overlay {
    z-index: var(--z-drawer);
  }

  .drawer:not(.fixed):not(.open) {
    margin-left: -16rem;
  }

  .drawer.fixed {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transition: transform 350ms ease;
    z-index: var(--z-drawer-fixed);
  }

  .drawer.fixed:not(.open) {
    transform: translateX(-105%);
  }

  .link {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    padding: 1em;
    transition: background-color 300ms ease;
    align-items: center;
    --ripple-color: rgba(var(--violet-rgb), 0.18);
    user-select: none;
    cursor: pointer;
  }

  .link.current {
    background: rgba(var(--violet-rgb), 0.1);
  }

  .link:hover {
    background: rgba(var(--violet-rgb), 0.075);
  }

  .link > :global(svg) {
    font-size: 1.25rem;
    margin: -0.25rem 0.4rem -0.25rem 0;
  }
  .top {
    height: 4rem;
    border-bottom: var(--border-gray) 1px solid;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .links {
    padding: 0.5rem 0 6rem 0;
  }
  .sep {
    height: 1px;
    margin: 0.5rem 0;
    background: rgba(0,0,0,0.18);
  }
</style>

{#if $drawerFixed && $drawerOpen}
  <div
    class="overlay"
    transition:fade|local={{ duration: 350 }}
    on:click={() => ($drawerOpen = false)} />
{/if}

<div
  class="drawer"
  class:fixed
  class:open
  class:elev3={fixed}
  on:click={click}>
  {#if $drawerFixed}
    <div class="top">
      <div class="btn-dark logo-menu" on:click={() => ($drawerOpen = false)}>
        <Menu />
        <Ripple />
      </div>
      <a class="na logo" href="./">FunTime</a>
    </div>
  {/if}

  <div class="links">
    <a
      class="na link"
      href="./"
      class:current={$page.path === '/' !== $page.path.startsWith("/mi-cuenta")}>
      <Home />
      Inicio
      <Ripple />
    </a>

    <a
      class="na link"
      href="viajes"
      class:current={$page.path.startsWith('/viajes')}>
      <Travel />
      Viajes
      <Ripple />
    </a>

    <a
      class="na link"
      href="noticias"
      class:current={$page.path.startsWith('/noticias')}>
      <News />
      Noticias
      <Ripple />
    </a>
    <a
      class="na link"
      href="eventos"
      class:current={$page.path.startsWith('/eventos') && !$page.path.startsWith("/eventos-")}>
      <Events />
      Eventos
      <Ripple />
    </a>
    <a
      class="na link"
      href="eventos-especiales"
      class:current={$page.path.startsWith('/eventos-especiales')}>
      <SpecialEvents />
      Eventos Especiales
      <Ripple />
    </a>

    <a
      class="na link"
      href="mailings"
      class:current={$page.path.startsWith('/mailings')}
    >
      <Mailing />
      Mailings
      <Ripple />
    </a>

    <a
    class="na link"
    href="templates"
    class:current={$page.path.startsWith('/templates')}
  >
    <Templates />
      Mailing Templates
    <Ripple />
  </a>

    <a
      class="na link"
      href="administracion"
      class:current={$page.path.startsWith('/administracion')}>
      <Admin />
      Administracion
      <Ripple />
    </a>
    <a
      class="na link"
      href="recruiting"
      class:current={$page.path.startsWith('/recruiting')}>
      <Recruiting />
      Recruiting
      <Ripple />
    </a>

    <div class="sep"></div>

    <a 
      class="na link"
      href="servicios"
      class:current={$page.path.startsWith("/servicios")}>
      <Task />
      Servicios
      <Ripple />
    </a>

    <a 
      class="na link"
      href="imagenes"
      class:current={$page.path.startsWith("/imagenes")}>
      <Image />
      Imágenes
      <Ripple />
    </a>

    <a 
      class="na link"
      href="archivos"
      class:current={$page.path.startsWith("/archivos")}>
      <Zip />
      Archivos
      <Ripple />
    </a>
  </div>
</div>