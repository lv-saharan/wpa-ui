const { h, classNames, define, getHost, throttle } = wpa;
import uiBase from "../uiBase";
import css from "./node.scss";
import sortable from "../sortable";

/**
 * @module TreeNode
 * @desc 树节点
 */

/**
 * @typedef {Object} Node
 * @property {string|number} key
 * @property {jsx} label
 * @property {boolean} expanded 是否展开
 * @property {boolean} checked 是否选中
 * @property {boolean} allowCheck 是否允许选中
 */

/**
 * TreeNode
 */
class TreeNode extends uiBase {
  static css = css;
  static defaultProps = {
    cssss: null,
    nodeLevel: 0,
    ignoreAttrs: true,
    expander: null,
  };
  static propTypes = {
    nodeLevel: Number,
    ignoreAttrs: Boolean,
  };

  /**
   * 获取树组件
   */
  get tree() {
    return this.$props.tree;
  }

  /**
   * 是否是多选树
   */
  get checkboxTree() {
    return this.tree.$props.checkboxTree;
  }

  /**
   * 是否是单选树
   */
  get radioTree() {
    return this.tree.$props.radioTree;
  }

  /**
   * 是否允许排序
   */
  get sortable() {
    return this.tree.$props.sortable;
  }
  /**
   * 节点是否选中
   */
  get selected() {
    return this.node.selected ?? this.tree.isSelected(this.key);
  }

  /**
   * 多选是否选中
   */
  get checked() {
    return this.node.checked ?? this.tree.isChecked(this.key);
  }

  /**
   * 单选是否选中
   */
  get radioed() {
    return this.node.radioed ?? this.tree.isRadioed(this.key);
  }
  /**
   * 是否展开
   */
  get expanded() {
    return this.node.expanded ?? this.tree.isExpanded(this.key);
  }

  get expander() {
    return (
      this.node.expander ?? this.$props.expander ?? this.tree.$props.expander
    );
  }

  /**
   * 当前节点值
   */
  get node() {
    return this.$props.node ?? {};
  }
  //children nodes
  #nodes;
  /**
   * children nodes
   * 排序时用来确定数组范围
   */
  get nodes() {
    return this.#nodes;
  }

  /**
   * 是否有子节点
   */
  get noChildren() {
    return !this.nodes || this.nodes.length == 0;
  }
  /**
   * 关键字路径
   */
  get path() {
    const pnode = this.parentTreeNode;
    const ppath = pnode ? pnode.path : "";
    const myPath = ppath + "/" + this.key;
    return myPath;
  }
  /**
   * 父节点
   */
  get parentTreeNode() {
    const pnode = getHost(this);
    return pnode instanceof TreeNode ? pnode : null;
  }

  /**
   * Key
   */
  get key() {
    return this.node.key ?? `node-${this.elementId}`;
  }
  /**
   * 当前层级
   */
  get level() {
    return this.$props.nodeLevel ?? 0;
  }

  /**
   * 展开
   */
  expand() {
    this.tree.expand(this.key, false);
    this.node.expanded = true;
    this.updateSelf();
        /**
     * @event module:Tree#nodeExpand 展开
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeExpand={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeExpand", { node: this.node, treeNode: this });
  }
  /**
   * 折叠
   */
  collapse() {
    this.tree.collapse(this.key, false);
    this.node.expanded = false;
    this.updateSelf();
    /**
     * @event module:Tree#nodeCollapse 折叠
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeCollapse={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeCollapse", { node: this.node, treeNode: this });
  }
  /**
   * 选中节点
   */
  select() {
    this.tree.select(this.key, false);
    if (this.tree.$props.multiSelect) {
      this.updateSelf();
    } else {
      if (this.tree.__selectedNode) {
        this.tree.__selectedNode.updateSelf();
      }
      this.tree.__selectedNode = this;
      this.updateSelf();
    }
    /**
     * @event module:Tree#nodeSelect 选中节点
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeSelect={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeSelect", { node: this.node, treeNode: this });
  }
  /**
   * 取消选中节点
   */
  unSelect() {
    this.tree.unSelect(this.key, false);
    this.updateSelf();
    /**
     * @event module:Tree#nodeUnSelect 取消选中节点
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeUnSelect={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeUnSelect", { node: this.node, treeNode: this });
  }
  /**
   * 多选选中
   */
  check() {
    this.tree.check(this.key, false);
    /**
     * @event module:Tree#nodeCheck 多选选中
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeCheck={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeCheck", { node: this.node, treeNode: this });
  }
  /**
   * 取消多选选中
   */
  uncheck() {
    this.tree.uncheck(this.key, false);
    /**
     * @event module:Tree#nodeUnRadio 取消多选选中
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeUnCheck={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeUnCheck", { node: this.node, treeNode: this });
  }
  /**
   * 单选选中
   */
  radio() {
    this.tree.radio(this.key, false);
    /**
     * @event module:Tree#nodeRadio 单选选中
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeRadio={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeRadio", { node: this.node, treeNode: this });
    if (this.tree.__radioedNode) {
      this.tree.__radioedNode.updateSelf();
    }
    this.tree.__radioedNode = this;
  }
  /**
   * 取消单选选中
   */
  unradio() {
    this.tree.unradio(this.key, false);
    /**
     * @event module:Tree#nodeUnRadio 取消单选
     * @prop {Object} data 节点信息{ node, treeNode }
     * @example
     *
     * <wp-tree onNodeUnRadio={evt=>{
     *    let data=evt.detail
     *    //do something
     * }} />
     */
    this.tree.fire("nodeUnRadio", { node: this.node, treeNode: this });
  }

  /**
   * 切换节点选中状态
   */
  toggle() {
    if (this.expanded) this.collapse();
    else this.expand();
  }
  get $checkbox() {
    return this.checkboxTree ? (
      this.node.allowCheck !== false ? (
        <input
          type="checkbox"
          class="form-check-input"
          disabled={this.node.disabled === true}
          checked={this.checked}
          onClick={(evt) => {
            evt.stopPropagation();
          }}
          onChange={(evt) => {
            if (evt.currentTarget.checked) {
              this.check();
            } else {
              this.uncheck();
            }
          }}
        />
      ) : (
        <div class="checkbox-placeholder" />
      )
    ) : null;
  }
  get $radio() {
    if (this.radioed) this.tree.__radioedNode = this;
    return this.radioTree ? (
      this.node.allowCheck !== false ? (
        <input
          type="radio"
          disabled={this.node.disabled === true}
          checked={this.radioed}
          onClick={(evt) => {
            evt.stopPropagation();
          }}
          onChange={(evt) => {
            if (evt.currentTarget.checked) {
              this.radio();
            } else {
              this.unradio();
            }
          }}
        />
      ) : (
        <div class="radio-placeholder" />
      )
    ) : null;
  }
  install() {}
  #Sortable;
  get Sortable() {
    return this.#Sortable;
  }
  async installed() {
    if (this.sortable) {
      const Sortable = await sortable.use();
      this.#Sortable = Sortable.create(this.$(".children"), {
        delay: 150,
        handle: ".element",
        // swapThreshold: 0.65,
        fallbackOnBody: true,
        invertSwap: true,
        group: this.tree.sortGroup,

        // onAdd: (evt) => {
        //   // const toHost = getHost(evt.to);
        //   // evt.item.update$Props(
        //   //   {
        //   //     nodeLevel: toHost.level + 1,
        //   //   },
        //   //   true,
        //   //   true
        //   // );
        //   //toHost.updateSelf();
        // },
        onEnd: (evt) => {
          const fromHost = getHost(evt.from);
          const toHost = getHost(evt.to);
          const fromNodes = fromHost.nodes;
          let toNodes = toHost.nodes;
          if (!toNodes) {
            toNodes = [];
            toHost.node.children = toNodes;
          }

          this.tree.fire("sorted", {
            fromNode: fromHost.node,
            fromNodes,
            toNode: toHost.node,
            toNodes,
            fromIndex: evt.oldIndex,
            toIndex: evt.newIndex,
          });
        },
      });

      // const $node = this.$(".node");
      // $node.addEventListener(
      //   "dragover",
      //   throttle(
      //     2000,
      //     (evt) => {
      //       $node.classList.add("hover");
      //     },
      //     { noLeading: true }
      //   )
      // );
      // $node.addEventListener("dragleave", (evt) => {
      //   $node.classList.remove("hover");
      // });
    }
  }
  async render(props) {
    let { node, cssss } = props;

    if (!this.tree.$props.multiSelect && this.selected) {
      this.tree.__selectedNode = this;
    }

    let $element = node.element ?? node.label ?? node.key;
    if (typeof $element == "function") {
      $element = await $element(node, props, this);
    }
    let $children = null;
    let children = (this.#nodes = node.children);
    if (typeof children === "function") {
      if (this.expanded) {
        this.#nodes = children = await children(node, props, this);
      }
    }

    $children = (
      <div
        class={classNames("children", {
          expanded: this.expanded,
          sortable: this.sortable,
          empty: this.noChildren,
        })}
      >
        {this.expanded &&
          (children instanceof Array
            ? children.map((child) => (
                <wp-tree-node
                  node={child}
                  node-level={this.level + 1}
                  tree={this.tree}
                  cssss={cssss}
                />
              ))
            : children)}
      </div>
    );

    return (
      <div
        class={classNames("node", {
          expanded: this.expanded,
          // "loading-children": this.#isloading,
          "no-children": this.noChildren,
        })}
      >
        <div
          class={classNames("element", { selected: this.selected })}
          style={`padding-left:calc(${this.level} * var(--wp-tree-node-indent,1rem))`}
          onClick={(evt) => {
            // console.log(evt)
            evt.stopPropagation();
            if (this.selected && evt.ctrlKey === true) this.unSelect();
            else this.select();
          }}
        >
          <div
            onClick={(evt) => {
              evt.stopPropagation();
              this.toggle();
            }}
            class={classNames("expander-wrap", {
              "no-children": this.noChildren,
            })}
          >
            {!this.noChildren && this.expander}
          </div>
          {this.$checkbox}
          {this.$radio}
          <div class="label">{$element}</div>
          {/* {this.#isloading ? <wp-loading /> : null} */}
        </div>
        {$children}
      </div>
    );
  }
}

define("wp-tree-node", TreeNode);
export default TreeNode;
