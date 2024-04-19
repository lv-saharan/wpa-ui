import uiBase,{ h, classNames,createRef, extractClass }  from "uiBase";
import { timingClassNames } from "../css";
import { getCSSStyleSheets } from "../css";

import css from "./index.scss";
/**
 * 位置
 * @readonly
 * @enum {string}
 */
const Placements = {
  Start: "start",
  End: "end",
  Top: "top",
  Bottom: "bottom",
};
/**
 * @module Offcanvas
 * @desc 边栏导航组件
 * @example
<wp-offcanvas
    visible
    position="static"
    style="border-top:solid 1px #ccc;border-bottom:solid 1px #ccc"
    title="hello"
  >
    hello,do something
  </wp-offcanvas>

  <div>
    <button
      onClick={(evt) => {
        this.leftRef.current.toggle();
      }}
    >
      toggle left
    </button>
    <button
      onClick={(evt) => {
        this.rightRef.current.toggle();
      }}
    >
      toggle right
    </button>
    <button
      onClick={(evt) => {
        this.topRef.current.toggle();
      }}
    >
      toggle top
    </button>
    <button
      onClick={(evt) => {
        this.bottomRef.current.toggle();
      }}
    >
      toggle bottom
    </button>
  </div>
  <wp-offcanvas ref={this.leftRef}>
    <div slot="title">
      <wp-icon name="home" /> 文件
    </div>
    hello,do something
  </wp-offcanvas>

  <wp-offcanvas
    ref={this.rightRef}
    placement="end"
    use-backdrop="false"
    duration="1"
  >
    <div slot="title">
      <wp-icon name="home" /> 文件
    </div>
    hello,do something
  </wp-offcanvas>

  <wp-offcanvas ref={this.topRef} placement="top">
    <div slot="title">
      <wp-icon name="home" /> 文件
    </div>
    hello,do something
  </wp-offcanvas>

  <wp-offcanvas ref={this.bottomRef} placement="bottom">
    <div slot="title">
      <wp-icon name="home" /> 文件
    </div>
    hello,do something
  </wp-offcanvas> 

*/

/**
 * @typedef {Object} Props
 * @property {boolean} [visible] 可见  默认：false
 * @property {jsx} title 标题
 * @property {Placements} [placement] 边栏位置，top,bottom,start,end
 * @property {string } [position] 位置 默认：fixed
 * @property {number } [duration] 动画时长 默认:.3s
 * @property {boolean } [useBackdrop] 使用背景 默认：true
 */
export default class extends uiBase {
  static css = [
    () => getCSSStyleSheets("reboot", "offcanvas", "utilities", "close"),
    css,
  ];
  static defaultProps = {
    visible: false,
    title: null,
    placement: "start", //end,top bottom
    duration: 0.3,
    position: "fixed",
    useBackdrop: true,
  };
  static propTypes = {
    visible: Boolean,
    placement: String,
    duration: Number,
    position: String,
    useBackdrop: Boolean,
  };
  /**
   * @type {Placements}
   */
  static get placements(){
    return Placements
  }
  css() {
    return `
    .offcanvas,.offcanvas-sm,.offcanvas-md,.offcanvas-lg,.offcanvas-xl,.offcanvas-xxl {
      transition-duration: ${this.$props.duration}s
   } `;
  }
  offcanvasRef = createRef();
  backdropRef = createRef();
  #isShow;
  async show() {
    if (this.#isShow) return;
    this.#isShow = true;
    await this.update(true, true);
    let el = this.offcanvasRef.current;
    this.backdropRef.current?.classList.add("show");
    el.setAttribute("aria-modal", true);
    el.setAttribute("role", "dialog");
    let { duration } = this.$props;
    timingClassNames(el, [
      {
        classNames: "showing",
        duration,
      },
      {
        classNames: "show",
      },
    ]);
  }
  /**
   * 展开或关闭
   */
  toggle() {
    if (this.#isShow) this.hide();
    else this.show();
  }
  /**
   * 展开
   */
  open() {
    this.show();
  }
  hide() {
    if (!this.#isShow) return;
    this.#isShow = false;
    let el = this.offcanvasRef.current;

    el.blur();
    let { duration } = this.$props;
    timingClassNames(el, [
      {
        classNames: "hiding show",
        duration,
      },
      {
        classNames: "",
        callback: () => {
          el.removeAttribute("aria-modal");
          el.removeAttribute("role");
          this.backdropRef.current?.classList.remove("show");
          this.updateSelf();
        },
      },
    ]);
  }
  /**
   * 关闭
  */
  close() {
    this.hide();
  }
  installed() {
    this.#isShow = this.$props.visible;
  }
  render(props) {
    let { visible, placement, position, title, useBackdrop } = this.$props;
    return (
      <>
        <div
          ref={this.offcanvasRef}
          {...extractClass(
            props,
            "offcanvas",
            `offcanvas-${placement}`,
            `position-${position}`,
            {
              show: visible,
            }
          )}
          tabindex="-1"
          aria-labelledby="offcanvasLabel"
        >
          <div class="offcanvas-header">
            <slot name="title" class="offcanvas-title h5">
              {title}
            </slot>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              onClick={(evt) => this.close()}
            ></button>
          </div>
          <slot class="offcanvas-body"></slot>
        </div>
        {useBackdrop && this.#isShow && (
          <div
            ref={this.backdropRef}
            class="offcanvas-backdrop fade"
            onClick={(evt) => {
              this.hide();
            }}
          ></div>
        )}
      </>
    );
  }
}
