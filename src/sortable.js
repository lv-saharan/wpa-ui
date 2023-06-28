const importURL = import.meta.url;
const JS = "sortable.core.esm.js";
let Root = new URL(`./sortablejs/`, importURL).href;
let Sortable = null;
let SortabelPlugins = {
  AutoScroll: false,
  Remove: false,
  Revert: false,
  MultiDrag: false,
  Swap: false,
};

/**
 * @module Sortable
 * @desc 排序组件
 */
/**
 * 使用排序组件，异步加载组件后进行初始化
 * @param {*} param0  {autoScroll, remove, revert, multiDrag, swap }
 * @param {*} root 
 * @returns 
 */
export async function use(
  { autoScroll, remove, revert, multiDrag, swap } = {
    autoScroll: true,
    remove: true,
    revert: true,
    multiDrag: false,
    swap: false,
  },
  root = Root
) {
  if (!Sortable) {
    const path = new URL(JS, root).href;
    Sortable = await import(path);
  }

  if (autoScroll && !SortabelPlugins.AutoScroll) {
    SortabelPlugins.AutoScroll = true;
    Sortable.Sortable.mount(new Sortable.AutoScroll());
  }
  const [Remove, Revert] = Sortable.OnSpill;
  if (remove && !SortabelPlugins.Remove) {
    SortabelPlugins.Remove = true;
    Sortable.Sortable.mount(Remove);
  }
  if (remove && !SortabelPlugins.Remove) {
    SortabelPlugins.Remove = true;
    Sortable.Sortable.mount(Remove);
  }
  if (revert && !SortabelPlugins.Remove) {
    SortabelPlugins.Revert = true;
    Sortable.Sortable.mount(Revert);
  }

  if (multiDrag && !SortabelPlugins.MultiDrag) {
    SortabelPlugins.MultiDrag = true;
    Sortable.Sortable.mount(new Sortable.MultiDrag());
  }

  if (swap && !SortabelPlugins.Swap) {
    SortabelPlugins.Swap = true;
    Sortable.Sortable.mount(new Sortable.Swap());
  }
  return Sortable.Sortable;
}

export function setRoot(root) {
  Root = root;
}

export default {
  use,
  setRoot,
};
