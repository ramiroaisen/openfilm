export const Uid = (n: number) => {
  return () => {
    let buffer = "";
    for (let i = 0; i < n; i++) {
      buffer += Math.floor(Math.random() * 32).toString(32);
    }
    return buffer;
  }
}

import removeAccents from "remove-accents";
export const slugify = (src: string) => {
  return removeAccents(src).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/ /g, "-")
}

export const capitalize = (src: string) => {
  if (src.length === 0) return "";
  return src[0].toUpperCase() + src.slice(1);
}

export const tick = () => new Promise(resolve => {
  setImmediate(resolve);
})

export const sleep = (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms);
})