<script lang="ts">
  export let movie: Movie;
  export let wide: boolean = false;

  import type { Movie } from "../../types";

  let a: HTMLElement;

  let timer: any;
  const mouseenter = () => {
    timer = setTimeout(() => {
      const rect = a.getBoundingClientRect();

      const top = false && rect.top < 50;
      const bottom = false && rect.bottom > window.innerHeight - 50;
      const left = rect.left < 50;
      const right = rect.right > window.innerWidth - 50;

      const x = (left && right || !left && !right) ? "50%" :
        left ? "0" : "100%";
      
      const y = (top && bottom || !top && !bottom) ? "50%" :
        top ? "0" : "100%";

      a.style.transformOrigin = `${x} ${y}`;
      wide = true;
    }, 500)
  }

  const mouseleave = () => {
    clearTimeout(timer);
    wide = false;
  }
</script>

<style>
  .movie {
    position: relative;
    display: flex;
    min-width: 10rem;
    transition: 
      transform 300ms ease,
      box-shadow 300ms ease,
      background-color 300ms ease,
      z-index 300ms ease;  
    flex-grow: 1;
    flex-shrink: none;
  }

  .movie.wide {
    transform: scale(1.5);
    padding: 0.5rem;
    margin: -0.5rem;
    box-shadow: #000 0 0 0.5rem 0;
    background: #141414;
    z-index: 10000;
  }

  .img {
    position: relative;
    width: 100%;
    padding-top: 147.2%;
  }

  .name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background: rgba(0,0,0,0.75);
    font-weight: 700;
    padding: 0.5rem;
    font-size: 0.65rem;
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .wide .name {
    opacity: 1;
  }
</style>

<a bind:this={a} class="na movie" class:wide href="peliculas/{movie.id}" on:mouseenter={mouseenter} on:mouseleave={mouseleave}>
  <div class="img cover" style="background-image: url({movie.listImageUrl})">
    <div class="name">
      {movie.name}
    </div>
  </div>
</a>