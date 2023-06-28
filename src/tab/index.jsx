const { h, Component, classNames, render } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";

/**
 * @module Tab
 * @desc 页签组件
 * @example
 <wp-tab
    active-key="lazy"
    active-event="hover"
    css=".nav wp-icon{display:none} .nav.active wp-icon{display:inline-block}"
    items={[
      {
        key: "basic",
        nav: "基本信息",
        pane: (
          <form>
            基本信息设置
            <input />
            name
            <input type="radio" />
            OK?
            <input type="checkbox" />
            oooooo
          </form>
        ),
      },
      {
        key: "position",
        nav: (
          <>
            岗位信息
            <wp-icon onClick={(e) => alert(e)} name="close" color="red" />
          </>
        ),
        pane: <div>岗位信息岗位信息岗位信息岗位信息岗位信息</div>,
      },
      {
        key: "lazy",
        nav: "延遲加載",
        pane: ({ update, vnode }) => {
          if (vnode.__pane) return vnode.__pane;
          setTimeout(() => {
            vnode.__pane = (
              <div>
                <a
                  href="https://juejin.cn/post/7037036742985121800"
                  target="_blank"
                >
                  很多的Loading效果
                </a>
              </div>
            );
            update();
          }, 1000);

          return <wp-loading name="rectangle" size="5" color="red" />;
        },
      },
    ]}
  />
*/

/**
 * @typeof {Object} Item
 * @property {jsx} nav 标签导航
 * @property {jsx} pane 标签内容
 * @property {string} [key] 标签Key
 *
 */

/**
 * @typedef {Object} Props
 * @property {string} [activeIndex]
 * @property {string} [activeKey]
 * @property {jsx} [activeEvent] 激活事件 默认：click ，click | hover
 * @property {Array.<Item> } items 页签项
 */

/**
 * items=[{key,nav|name,pane,__pane}]
 */
export default class extends uiBase {
  static css = css;
  static defaultProps = {
    activeIndex: null, //undefined
    activeKey: null,
    activeEvent: "click", //or hover
  };
  static propTypes = {
    activeIndex: Number,
    activeKey: String,
    activeEvent: String,
  };

  /**
   * 当前激活项的Index
   */
  get activeIndex() {
    return this.$props.activeIndex ?? 0;
  }
  /**
   * 当前激活项的Key
   */
  get activeKey() {
    return this.$props.activeKey;
  }

  /**
   * 激活指定项
   * @param {string|number} param0 index 或 key
   * @param {*} type 
   */
  async active({ index, key }, type = null) {
    if (type == null || type == this.$props.activeEvent) {
      if (this.activeKey) {
        this.update$Props(
          {
            activeKey: key,
          },
          { ignoreAttrs: true, updateSelf: true }
        );
      } else {
        this.update$Props(
          {
            activeIndex: index,
          },
          { ignoreAttrs: true, updateSelf: true }
        );
      }
    }
  }

  get slotPanes() {
    const slot = this.$("slot");
    const panes = slot?.assignedElements();
    return panes;
  }
  async render(props) {
    let settings = this.$props;
    let items = props.items ?? settings.items;
    let $navs = [];
    let $panes = [];
    for (let index = 0; index < (items ?? []).length; index++) {
      let item = items[index];
      let isActive = this.activeKey
        ? this.activeKey == item.key
        : index == this.activeIndex;

      let $pane = item.pane;
      // if (isActive && typeof $pane == "function") {
      //   $pane = $pane(item, settings, this);
      // }
      $panes.push(
        <div
          key={`pane-${item.key ?? index}`}
          className={classNames("pane", {
            active: isActive,
          })}
        >
          {$pane}
        </div>
      );
      $navs.push(
        <div
          key={`nav-${item.key ?? index}`}
          className={classNames("nav", {
            active: isActive,
          })}
          onMouseEnter={() => this.active({ index, key: item.key }, "hover")}
          onclick={() => this.active({ index, key: item.key }, "click")}
        >
          {item.nav ?? item.name ?? item.key}
        </div>
      );
    }
    return (
      <div class="tabs">
        <div class="navs">{$navs}</div>
        <div class="panes">
          {$panes}
          <slot></slot>
        </div>
      </div>
    );
  }
}
