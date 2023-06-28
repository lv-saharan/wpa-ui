const { h, purgeCSSSS, getHost, classNames } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";
import treeNode from "./node";
import sortable from "../sortable";
export { treeNode };

/**
 * @module Tree
 * @desc 树形组件
 * @example
 <wp-import src={new URL("../remote/index.js", import.meta.url).href} module="welcome" />
 <hr />
 <wp-import src={new URL("../remote/index.js", import.meta.url).href} module="user" />
 */

/**
 * @typedef {Object} Props
 * @property {Object} [nodeCss] 节点样式表，自动注入所有子节点可以是任何可以转换成CSSStyleSheet的结构
 * @property {boolean} [radioTree] 单选树 默认：false
 * @property {boolean} [checkboxTree] 多选树，默认:false
 * @property {boolean} [multiSelect] 可选中多行，默认：flase
 * @property {boolean} [sortable] 可排序，默认:false
 * @property {string} [sortGroup] 排序分组名，默认自动生成
 * @property {string|number} [selectedKey] 选中行的Key
 * @property {Array} [selectedKeys] 选中行的Keys
 * @property {Array} [expandedKeys] 展开的Keys
 * @property {Array} [checkedKeys] 多选选中的Keys
 * @property {string|number} [radioedKey] 单选选中的Key
 * @property {Array.<Node>} nodes 树节点，支持子级和动态加载
 * @property {jsx} expander 展开元素
 */

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
  /**
   * 排序分组名称
   */
  get sortGroup() {
    return this.$props.sortGroup ?? `sort-${this.elementId}`;
  }
  /**
   * 获取选中行的Keys
   */
  get selectedKeys() {
    return this.$props.selectedKeys;
  }
  /**
   * 获取选中行的Key
   */
  get selectedKey() {
    return this.$props.selectedKey;
  }

  /**
   * 获取展开节点的Keys
   */
  get expandedKeys() {
    return this.$props.expandedKeys;
  }
  /**
   * 获取选中节点的Keys
   */
  get checkedKeys() {
    return this.$props.checkedKeys;
  }

  /**
   * 获取单选节点的Key
   */
  get radioedKey() {
    return this.$props.radioedKey;
  }

  #Sortable;
  get Sortable() {
    return this.#Sortable;
  }
  /**
   * 判断指定key是否选中
   * @param {*} key
   * @returns {boolean}
   */
  isSelected(key) {
    let { multiSelect, selectedKey, selectedKeys } = this.$props;
    if (!multiSelect) return selectedKey != null && selectedKey == key;
    else return (selectedKeys ?? []).some((k) => k == key);
  }

  /**
   * 设置指定值的行选中
   * @param {*} val
   * @param {boolean} update
   */
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
  /**
   * 取消选中指定行
   * @param {*} val
   * @param {boolean} update
   */
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
  /**
   * 判断key是否勾选
   * @param {*} key
   * @returns {boolean}
   */
  isChecked(key) {
    let { checkboxTree, checkedKeys } = this.$props;
    if (checkboxTree) return (checkedKeys ?? []).some((k) => k == key);
    return false;
  }
  /**
   * 勾选指定Key
   * @param {*} key
   * @param {boolean} update
   */
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
  /**
   * 取消勾选Key
   * @param {*} key
   * @param {boolean} update
   */
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
  /**
   * 判断指定Key是否选中
   * @param {*} key
   * @returns {boolean}
   */
  isRadioed(key) {
    let { radioTree, radioedKey } = this.$props;
    if (radioTree) return radioedKey != null && radioedKey == key;
    return false;
  }
  /**
   * 单选选中指定Key
   * @param {*} key
   * @param {boolean} update
   */
  radio(key, update = true) {
    let { radioTree } = this.$props;
    if (radioTree) this.$props.radioedKey = key;
    if (update) this.update();
  }
  /**
   * 取消单选选中
   * @param {boolean} update
   */
  unradio(update = true) {
    let { radioTree } = this.$props;
    if (radioTree) this.$props.radioedKey = null;
    if (update) this.update();
  }
  /**
   * 判断Key是否展开
   * @param {*} key
   * @returns {boolean}
   */
  isExpanded(key) {
    let { expandedKeys } = this.$props;
    return (expandedKeys ?? []).some((k) => k == key);
  }
  /**
   * 展开Key对应的节点
   */
  expand(key, update = true) {
    let { expandedKeys } = this.$props;
    let index = expandedKeys.indexOf(key);
    if (index == -1) expandedKeys.push(key);
    if (update) this.update();
  }
  /**
   * 关闭Key对应的节点
   * @param {*} key
   * @param {boolean} update
   */
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

          /**
           * @typedef {Object} SortData
           * @property {Node} fromNode 
           * @property {Array.<Node>} fromNodes
           * @property {Node} toNode
           * @property {Array.<Node>} toNodes
           * @property {number} fromIndex
           * @property {number} toIndex
           */

          /**
           * @event module:Tree#sorted 排序
           * @prop {SortData} data 排序信息
           * @example
           *
           * <wp-tree onSorted={evt=>{
           *    let sortData=evt.detail
           *    //do something
           * }} />
           */
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

  /**
   * 获取所有节点
   */
  get nodes() {
    let nodes = this.$props.nodes;
    let host = getHost(this);
    if (typeof nodes === "function") {
      nodes = nodes.call(host);
    }
    return nodes;
  }
  /**
   * 设置节点
   */
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
