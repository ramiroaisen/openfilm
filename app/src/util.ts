import type { Preload } from "sapper/types";
import qs from "qs";
import { getNotifier } from "./components/Notify/notify";

export const ApiMap = (url?: string): Preload => {
  return async function(page, session) {
    const qss = qs.stringify(page.query);
    const target = url == null ? 
      `api${page.path}${qss ? `?${qss}` : ""}` :
      url.replace(/\:([a-z0-9]+)/gi, (match, p1) => {
        return page.params[p1];
      })

    const json = await this.fetch(target).then(res => res.json());
    if(json.error) throw json.error;
    return json;
  }
}

const p = (n: number, size = 2) => String(n).padStart(size, "0");

export const fdate = (src: any) => {
  if(src === null) return "";
  const d = new Date(src);
  if(Number.isNaN(d.getTime())) return "";
  return p(d.getFullYear(), 4)  + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate())  
}

export const fdatetime = (src: any) => {
  if (src === null) return "";
  const d = new Date(src);
  if(Number.isNaN(d.getTime())) return "";
  return `${p(d.getFullYear(), 4)}/${p(d.getMonth() + 1)}/${p(d.getDate())} a las ${d.getHours()}:${p(d.getMinutes())}`
}

export const encode = (src: string) => encodeURIComponent(src).replace(/\%20/g, "+");



export const Selection = () => {

  let saved: any = null;

  const get = () => {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel && sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }

    return null;
  }

  const set = (range: any) => {
    if (range) {
      var sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  const save = () => {
    saved = get();
  }

  const restore = () => set(saved);

  return {
    get, set, save, restore
  }
}

export const fars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export const fusd = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
})


// @ts-ignore
export const keyed = <T, K extends keyof T> (key: K, list: T[]): Record<T[K], T> => {
  // @ts-ignore
  const record: Record<T[K], T> = {};
  for(const item of list) {
    record[item[key]] = item;
  }
  return record;
}


export const action = <T extends (...args: any[]) => Promise<void>>(fn: T): T => {
  let processing = false;
  // @ts-ignore
  return (...args: Parameters<T>) => {
    if(processing) return;
    processing = true;
    fn(...args)
    .catch(e => getNotifier().error(e.message))
    .finally(() => processing = false)
  }
}

export const _handle = <T>(p: Promise<Response>): Promise<any> => {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const json = await p.then(r => r.json()) as any;
      if(json.error) throw new Error(json.error.message);
      resolve(json);
    } catch(e) {
      reject(e);
    }
  })
}

export const _get = async (url: string) => _handle(fetch(url));

export const _post = async <T extends object>(url: string, body: T) => _handle(
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
);

export const _put = <T extends object>(url: string, body: T) => _handle(
  fetch(url, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
);

export const _delete = (url: string) => _handle(fetch(url, {method: "DELETE"}));

export const equals = (src: any, target: any): boolean => {
  
  if(src instanceof Date && target instanceof Date) {
    return +src === +target;
  }

  if(src instanceof Array) {
    
    if(!(target instanceof Array)) return false;
    
    if(src.length !== target.length) return false;
    
    for(let i = 0; i < src.length; i++) {
      if(!equals(src[i], target[i])) return false;
    }
    
    return true;
  }

  if(typeof src === "object" && src !== null) {
    
    if(!(typeof target === "object" && target !== null)) return false;
    
    if(Object.keys(src).length !== Object.keys(target).length) return false;
    
    for(const key of Object.keys(src)) {
      if(!equals(src[key], target[key])) return false;
    }
    
    return true;
  }

  return src === target;
}

export const diff = <T extends Record<string, any>>(db: T, current: T) => {
  const set: Record<string, any> = {};
  for(const key of Object.keys(db)) {
    if(!equals(db[key], current[key])) {
      set[key] = current[key];
    }
  }
  return set;
}

export const clone = <T>(src: T): T => {
  
  // @ts-ignore
  if(src instanceof Date) return new Date(src); 

  if(src instanceof Array) {
    const target = [];
    for(const item of src) {
      target.push(clone(item))
    }
    // @ts-ignore
    return target;
  }

  if(typeof src === "object" && src !== null) {
    const target = {};
    for(const key of Object.keys(src)) {
      // @ts-ignore
      target[key] = clone(src[key]);
    }

    // @ts-ignore
    return target;
  }

  return src;
}

export const fnumber = (n: number) => (new Intl.NumberFormat()).format(n);