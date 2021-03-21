import Notify from "./Notify.svelte";

let notify: InstanceType<typeof Notify> | null = null;

export const getNotifier = () => {
  if(notify != null) 
    return notify;
  
  notify = new Notify({target: document.body});

  return notify;
}
