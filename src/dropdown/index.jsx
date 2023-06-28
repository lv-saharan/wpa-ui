const { h, classNames, createRef } = wpa
import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import uiBase from "../uiBase";
import { getCSSStyleSheets } from "../css";
import css from "./index.scss";

//当前显示的下拉关上
let $visibleDropDown = null;

document.addEventListener("click", (evt) => {
  if ($visibleDropDown) $visibleDropDown.hide();
});


/**
 *@module Dropdown 
 *@desc 下拉菜单
*/
 
   

/**
 * @typedef {Object} Props
 * @property {string} [placement] 位置 如： top-start ,top-end , right, right-start, right-end , bottom , bottom-start, bottom-end , left, left-start, left-end
 * @property {string} [strategy]  定位方式 如：absolute,fixed
 * @property {string} [trigger]  触发方式 如：click，focus
 * @property {number} [offset]  偏移量 默认：0
 * @property {jsx} [menu]  下拉内容，也可以通过slot显示
 * @property {HTMLElement|string} [reference]  触发元素
 * 
 */
   

 /**
 * @extends uiBase
 * @hideconstructor
 * @example 
 
      <wp-dropdown
            placement="bottom-start"
            menu={
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            }
          >
            <button class="btn btn-secondary" type="button">
              Dropdown button1
            </button>
          </wp-dropdown>


          <wp-dropdown placement="bottom-start">
            <button class="btn btn-secondary" type="button">
              Dropdown button1
            </button>
            <ul class="dropdown-menu" slot="menu">
              <li>
                <a class="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </wp-dropdown>
 */
export default class extends uiBase {
  static css = [
    () => getCSSStyleSheets("reboot", "utilities", "transitions", "dropdown"),
    css,
  ];
  static defaultProps = {
    placement: "bottom",
    strategy: "absolute",
    trigger: "click",
    offset: 0,
    menu: null,
    reference: null, //哪個對象？
  };
  static propTypes = {
    placement: String,
    strategy: String,
    trigger: String,
    offset: Number,
  };

  #menuRef = createRef();
  /**
   * 菜单元素
   */
  get $menu() {
    return this.#menuRef.current;
  }

  #slotRef = createRef();
  get #$slot() {
    return this.#slotRef.current;
  }
  get #$reference() {
    let assignedElements = this.#$slot.assignedElements();
    if (assignedElements.length === 0) {
      let { reference } = this.$props;
      if (typeof reference == "string") {
        return this.getRootNode()?.querySelector(reference);
      } else {
        //支持使用creatRef绑定的对象
        return reference?.current ?? reference;
      }
    } else {
      return assignedElements.at(0);
    }
  }
  setPosition() {
    let { placement, offset: _offset, strategy } = this.$props;

    computePosition(this.#$reference, this.$menu, {
      strategy,
      placement,
      middleware: [flip(), shift(), offset(_offset)],
    }).then(({ x, y, placement }) => {
      Object.assign(this.$menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
  #visible = false;
  /**
   * 显示
   */
  show() {
    this.#visible = true;
    this.#$slot.focus();
    this.#$slot.setAttribute("aria-expanded", true);
    this.#$slot.classList.add("show");
    Object.assign(this.$menu.style, {
      display: "block",
      position: this.$props.strategy,
    });

    $visibleDropDown = this;
    this.setPosition();
  }
  /**
   * 隐藏
   */
  hide() {
    this.#visible = false;
    this.#$slot.classList.remove("show");
    this.#$slot.setAttribute("aria-expanded", "false");
    $visibleDropDown = null;
    Object.assign(this.$menu.style, {
      display: "none",
    });
  }
  /**
   * 折叠
   */
  toggle() {
    if (this.#visible) this.hide();
    else {
      this.show();
    }
  }

  installed() {
    const { trigger } = this.$props;

    if (trigger == "click") {
      this.#$reference.addEventListener("click", (evt) => {
        if ($visibleDropDown && $visibleDropDown != this)
          $visibleDropDown.hide();
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.toggle();
      });
    } else if (trigger == "focus") {
      this.#$reference.addEventListener("focus", (evt) => {
        if ($visibleDropDown && $visibleDropDown != this)
          $visibleDropDown.hide();
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.show();
      });
      this.#$reference.addEventListener("blur", (evt) => {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.hide();
      });
    }
    this.addEventListener("click", (evt) => {
      evt.stopImmediatePropagation();
    });
  }
  render(props) {
    let { menu } = this.$props;
    return (
      <>
        <slot ref={this.#slotRef}></slot>
        <slot name="menu" ref={this.#menuRef}>
          {menu}
        </slot>
      </>
    );
  }
}
