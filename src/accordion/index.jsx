const { h, classNames } = wpa;
import uiBase from "../uiBase";
import { getCSSStyleSheets } from "../css";
import effect from "../effect";

/**
 * @readonly
 * @enum {string}
 */
const  DIRECTIONS= {
  /**
   * @description 水平
   */
  HORIZONTAL: "horizontal",
  /**
   * @description 垂直
   */
  VERTICAL: "vertical",
};
const CLASS_NAME_COLLAPSED = "collapsed";


/** 
 * @module Accordion 
 * @desc 手风琴组件
 * @example 
 
  <wp-accordion first-open items={[{key:"home",header:"Home",body:<h1>body</h1>}]}/>
*/
 
/**
 * @typedef {Object} Props
 * @property {boolean} [alwaysOpen] 一直打开 
 * @property {boolean} [firstOpen] 第一个打开
 * @property {number} [transitionDuration] 折叠速度
 * @property {string } [direction] 显示方向 horizontal | vertical
 * @property {Array.<Item>} items 项
 */
   
/**
 * @typedef {Object} Item
 * @property {string} [key] 关键字（可选）
 * @property {boolean} [opened] 是否展开
 * @property {string|JSX} header Header
 * @property {string|JSX} body  Body
 */
 
export default class extends uiBase {
  /**
   * 默认注入的bootstrap样式：
   *  "reboot",
      "utilities",
      "accordion",
      "close",
      "transitions"
   * @returns {Array}
   */
  static css = () =>
    getCSSStyleSheets(
      "reboot",
      "utilities",
      "accordion",
      "close",
      "transitions"
    );


  static get DIRECTIONS() {
    return DIRECTIONS;
  }
  /**
   * 组件属性
   * @type {Props}
   * 
   */
  static defaultProps = {
    alwaysOpen: false,
    firstOpen: false,
    transitionDuration: 0.35,
    direction: DIRECTIONS.VERTICAL,
  };
  static propTypes = {
    alwaysOpen: Boolean,
    firstOpen: Boolean,
    transitionDuration: Number,
    direction: String,
  };
  css() {
    return `
      .collapsing {
          transition-duration: ${this.$props.transitionDuration}s ;
      }`;
  }
  install() {
    let { items, alwaysOpen, firstOpen } = this.$props;
    if (items.length > 0 && firstOpen) {
      items[0].opened = true;
    }
    if (!alwaysOpen) {
      let opens = items.filter((item) => item.opened);
      if (opens.length) {
        let firstOpened = opens.shift();
        firstOpened.opened = true;
        opens.forEach((item) => (item.opened = false));
      }
    }
  }
  get dimension() {
    return this.setting.direction == DIRECTIONS.HORIZONTAL ? WIDTH : HEIGHT;
  }
  #toggle(item) {
    let { items, transitionDuration } = this.$props;
    let index = items.indexOf(item);
    let $item = this.$(`.accordion>.accordion-item:nth-child(${index + 1})`);
    let $collapse = $item.querySelector(".accordion-collapse");
    let $header = $item.querySelector(".accordion-button");
    item.opened = !item.opened;
    $header.classList.toggle(CLASS_NAME_COLLAPSED, !item.opened);
    if (item.opened) {
      //show
      effect.collapse.show($collapse);
      /**
       * @event module:Accordion#collapseShow 展开
       * @prop {Item} item 当前展开项
       * @example
       * 
       * <wp-accordion onCollapseShow={evt=>{
       *    let item=evt.detail
       *    //do something
       * }} />
       */
      this.fire("collapseShow", item);
    } else {
      /**
       * @event module:Accordion#collapseHide 关闭
       * @prop {Item} item 当前关闭项
       * @example
       * 
       * <wp-accordion onCollapseHide={evt=>{
       *    let item=evt.detail
       *    //do something
       * }} />
       */
      effect.collapse.hide($collapse);
      this.fire("collapseHide", item);
    }
  }
  /**
   * 折叠指定项
   * @param {Item|number|string} item 可以是Object项，或该项的Index，或该项的Key
   * @fires module:Accordion#toggle
   */
  toggle(item) {
    let { items, alwaysOpen } = this.$props;
    if (typeof item ==="number") {
      item =items.at(item);
    }else if(typeof item=="string"){
      item=items.find(it=>it.key==item);
    }
    if (alwaysOpen) {
      this.#toggle(item);
    } else {
      let prevIndex = items.findIndex((_item) => _item.opened);
      let prevOpened = prevIndex == -1 ? null : items[prevIndex];
      if (prevOpened && prevOpened != item) {
        this.#toggle(prevOpened);
      }
      this.#toggle(item);
    }
  }
  render() {
    let { items, direction } = this.$props;

    return (
      <div
        class={classNames("accordion", {
          "collapse-horizontal": direction == DIRECTIONS.HORIZONTAL,
        })}
      >
        {items.map((item, index) => (
          <div class="accordion-item" key={item.key ?? `item-${index}`}>
            <h2 class="accordion-header">
              <button
                class={classNames("accordion-button", {
                  collapsed: !item.opened,
                })}
                type="button"
                aria-expanded={item.opened}
                onClick={(evt) => {
                  this.toggle(item);
                }}
              >
                {item.header}
              </button>
            </h2>
            <div
              class={classNames("accordion-collapse", {
                collapse: true,
                show: item.opened,
              })}
            >
              <div class="accordion-body">
                {typeof item.body == "function"
                  ? item.body(item, this.$props, this)
                  : item.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
