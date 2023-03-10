const { h, purgeCSSSS, getHost, classNames } = wpa
import uiBase from "../uiBase";
import css from "./index.scss";
import treeNode from "./node";
import sortable from "../sortable";
export { treeNode };
export default class extends uiBase {
  static css = css;
  static defaultProps = {
    nodeCss: null, //节点样式表，可以是任何可以转换成CSSStyleSheet的结构
    radioTree: false,
    checkboxTree: false,
    multiSelect: false, //可單選的樹 | true 多選
    sortable: false,
    sortGroup: null,
    ignoreAttrs: true,
    selectedKey: null, //選中的行
    selectedKeys: [],
    expandedKeys: [], //展開
    checkedKeys: [], //多選
    radioedKey: null, //單選
    nodes: [], //節點
    expander: <wp-icon name="keyboard_arrow_right" class="expander" />,
  };
  static propTypes = {
    ignoreAttrs: Boolean,
    multiSelect: Boolean,
    sortable: Boolean,
    selectedKey: String,
    selectedKeys: Array,
    expandedKeys: Array,
    checkedKeys: Array,
    radioedKey: String,
    nodes: Array,
  };
  get sortGroup() {
    return this.$props.sortGroup ?? `sort-${this.elementId}`;
  }
  get selectedKeys() {
    return this.$props.selectedKeys;
  }
  get selectedKey() {
    return this.$props.selectedKey;
  }

  get expandedKeys() {
    return this.$props.expandedKeys;
  }
  get checkedKeys() {
    return this.$props.checkedKeys;
  }

  get radioedKey() {
    return this.$props.radioedKey;
  }

  #Sortable;
  get Sortable() {
    return this.#Sortable;
  }
  isSelected(key) {
    let { multiSelect, selectedKey, selectedKeys } = this.$props;
    if (!multiSelect) return selectedKey != null && selectedKey == key;
    else return (selectedKeys ?? []).some((k) => k == key);
  }

  select(val, update = true) {
    let { multiSelect, selectedKeys } = this.$props;
    if (!multiSelect) this.$props.selectedKey = val;
    else {
      if (!selectedKeys.some((k) => k == val)) {
        selectedKeys.push(val);
      }
    }
    if (update) this.update();
  }
  unSelect(val, update = true) {
    let { multiSelect, selectedKeys } = this.$props;
    if (!multiSelect) this.$props.selectedKey = null;
    else {
      let index = selectedKeys.indexOf(val);
      if (index != -1) {
        selectedKeys.splice(index, 1);
      }
    }
    if (update) this.update();
  }
  isChecked(key) {
    let { checkboxTree, checkedKeys } = this.$props;
    if (checkboxTree) return (checkedKeys ?? []).some((k) => k == key);
    return false;
  }
  check(key, update = true) {
    let { checkboxTree, checkedKeys } = this.$props;
    if (checkboxTree) {
      let index = checkedKeys.indexOf(key);
      if (index == -1) {
        checkedKeys.push(key);
      }
    }
    if (update) this.update();
  }
  uncheck(key, update = true) {
    let { checkboxTree, checkedKeys } = this.$props;
    if (checkboxTree) {
      let index = checkedKeys.indexOf(key);
      if (index != -1) {
        checkedKeys.splice(index, 1);
      }
    }
    if (update) this.update();
  }
  isRadioed(key) {
    let { radioTree, radioedKey } = this.$props;
    if (radioTree) return radioedKey != null && radioedKey == key;
    return false;
  }
  radio(key, update = true) {
    let { radioTree } = this.$props;
    if (radioTree) this.$props.radioedKey = key;
    if (update) this.update();
  }
  unradio(update = true) {
    let { radioTree } = this.$props;
    if (radioTree) this.$props.radioedKey = null;
    if (update) this.update();
  }
  isExpanded(key) {
    let { expandedKeys } = this.$props;
    return (expandedKeys ?? []).some((k) => k == key);
  }
  expand(key, update = true) {
    let { expandedKeys } = this.$props;
    let index = expandedKeys.indexOf(key);
    if (index == -1) expandedKeys.push(key);
    if (update) this.update();
  }
  collapse(key, update = true) {
    let { expandedKeys } = this.$props;
    let index = expandedKeys.indexOf(key);
    if (index != -1) expandedKeys.splice(index, 1);
    if (update) this.update();
  }
  async installed() {
    if (this.$props.sortable) {
      const Sortable = await sortable.use();
      this.#Sortable = Sortable.create(this.rootNode, {
        delay: 150,
        fallbackOnBody: true,
        invertSwap: true,
        group: this.sortGroup,
        // onAdd: (evt) => {
        //   // const toHost = getHost(evt.to);
        //   // evt.item.update$Props({ nodeLevel: 0 }, true, true);
        //   //toHost.updateSelf();
        // },

        onEnd: (evt) => {
          const fromHost = getHost(evt.from);
          const toHost = getHost(evt.to);
          const fromNodes = fromHost.nodes;
          const toNodes = toHost.nodes;

          this.fire("sorted", {
            fromNode: fromHost.node,
            fromNodes,
            toNode: toHost.node,
            toNodes,
            fromIndex: evt.oldIndex,
            toIndex: evt.newIndex,
          });
        },
      });
    }
  }

  get nodes() {
    let nodes = this.$props.nodes;
    let host = getHost(this);
    if (typeof nodes === "function") {
      nodes = nodes.call(host);
    }
    return nodes;
  }
  set nodes(value) {
    this.$props.nodes = value;
  }
  render() {
    let host = getHost(this);
    let cssss = purgeCSSSS(this.$props.nodeCss, host);
    return (
      <div
        class={classNames("tree-container", {
          sortable: this.sortable,
        })}
      >
        {this.nodes.map((n) => (
          <wp-tree-node node={n} tree={this} cssss={cssss} />
        ))}
      </div>
    );
  }
}
