import uiBase, { h, classNames,createRef, extractClass } from "uiBase";
import { getCSSStyleSheets } from "../css";
import css from "./index.scss";
import effect from "../effect";

/**
 * @module Toast
 * @desc 提示框
 * @example
  <wp-toast visible>
    <span slot="header">
      <img
        src="https://tse1-mm.cn.bing.net/th/id/OIP-C.gAwrrAwnrp1bDE8Z-1ibmQHaJU?w=134&h=180&c=7&r=0&o=5&dpr=2.07&pid=1.7"
        class="rounded me-2"
        style="height:3rem;"
        alt="..."
      />
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
    </span>
    hello!
  </wp-toast>
*/

/**
 * @typedef {Object} Props
 * @property {boolean} visible 是否可见 默认：false 
 */

export default class extends uiBase {
  static css = [
    () => getCSSStyleSheets("reboot", "utilities", "toasts", "close"),
    css,
  ];

  static defaultProps = {
    visible: false,
  };
  static propTypes = {
    visible: Boolean,
  };
  #closed = true;
  get closed() {
    return this.#closed;
  }
  /**
   * 关闭
   */
  close() {
    this.#closed = true;
    effect.fade.hide(this).then(() => {
      this.update();
    });
  }

  show() {
    this.open();
  }
  /**
   * 打开
   */
  open() {
    this.#closed = false;
    this.update();

    effect.fade.show(this);
  }
  install() {
    this.#closed = !this.$props.visible;
  }
  render(props) {
    return (
      <div
        {...extractClass(props, "toast", { show: !this.#closed })}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <slot name="header"></slot>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={(evt) => {
              this.close();
            }}
          ></button>
        </div>
        <div class="toast-body">
          <slot></slot>
        </div>
      </div>
    );
  }
}
