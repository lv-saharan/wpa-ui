const { h, classNames, extractClass } = wpa;
// import { createPopper } from '@popperjs/core';
import uiBase from "../uiBase";
import { getCSSStyleSheets, timingClassNames } from "../css";
import css from "./index.scss";



/**
 * @module Modal
 * @desc 对话框组件
 * @example
  
<wp-modal
    id="m4"
    static-backdrop
    title={
      <>
        <wp-icon name="home" /> HOME
      </>
    }
  >
    <p>Modal body text goes here.</p>
    <p>Modal body text goes here.</p>
    <p>Modal body text goes here.</p>
    <p>Modal body text goes here.</p>
    <div slot="footer">
      <button
        type="button"
        class="btn btn-secondary"
        onClick={(evt) => {
          let modal = evt.target.closest("wp-modal");

          modal.close();
          console.log(modal);
        }}
      >
        Close
      </button>

      <button type="button" class="btn btn-primary">
        Save changes
      </button>
    </div>
  </wp-modal>
 */

/**
 * @typedef {Object} Props
 * @property {boolean} [staticPosition] 静态位置 默认：false
 * @property {boolean} [staticBackdrop] 不自动关闭 默认：false
 * @property {boolean} [vcentered] 垂直居中
 * @property {boolean } [visible] 显示
 * @property {jsx } [title] 标题
 * @property {boolean } [scrollable] 是否屏幕滚动 默认：flase
 * @property {boolean } [fullscreen] 全屏 默认：flase
 * @property {string } [size] 大小 如：xxl xl lg md （default ）sm
 */

export default class extends uiBase {
  static css = [
    () =>
      getCSSStyleSheets("reboot", "modal", "utilities", "close", "scrollbar"),
    css,
  ];
  static defaultProps = {
    staticPosition: false,
    staticBackdrop: false,
    vcentered: false,
    visible: false,
    title: null,
    scrollable: false,
    fullscreen: false,
    size: null, // xl lg default sm
  };
  static propTypes = {
    staticPosition: Boolean,
    staticBackdrop: Boolean,
    vcentered: Boolean,
    visible: Boolean,
    scrollable: Boolean,
    size: String,
    fullscreen: Boolean,
  };
  /**
   * 打开
   * @fires module:Modal#open
   */
  open() {
    this.update$Props({ visible: true }).then(() => {
      timingClassNames(this.$dialog, [
        {
          classNames: "show",
        },
      ]);
    });

    /**
     * @event module:Modal#open 打开
     * @example
     *
     * <wp-modal onOpen={evt=>{
     *    //do something
     * }}></wp-modal>
     */
    this.fire("open");
  }
  /**
   * 关闭
   * @fires module:Modal#close
   */
  close() {
    timingClassNames(this.$dialog, [
      {
        classNames: "show",
      },
      {
        classNames: "",
        duration: 0.15,
      },
      {
        classNames: "",
        callback: () => {
          this.update$Props({ visible: false });
        },
      },
    ]);
    /**
     * @event module:Modal#close 关闭
     * @example
     *
     * <wp-modal onClose={evt=>{
     *    //do something
     * }}></wp-modal>
     */
    this.fire("close");
  }

  get $dialog() {
    return this.$(".modal-dialog");
  }
  css() {}

  render(props) {
    let settings = this.$props;
    return (
      <>
        {settings.visible && !settings.staticPosition && (
          <div class={classNames("modal-backdrop", "show")}></div>
        )}
        <div
          {...extractClass(props, "modal", {
            "position-static": settings.staticPosition,
            "d-block": settings.staticPosition || settings.visible,
            // fade: true,
            // show: true,
          })}
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(evt) => {
            if (evt.target !== evt.currentTarget) return;
            if (settings.staticBackdrop) {
              return false;
            } else {
              this.close();
            }
          }}
        >
          <div
            class={classNames(
              "modal-dialog",
              settings.size ? `modal-${settings.size}` : false,
              {
                "modal-fullscreen": settings.fullscreen,
                "modal-dialog-scrollable": settings.scrollable,
                "modal-dialog-centered": settings.vcentered,
              }
            )}
          >
            <div class="modal-content">
              <div class="modal-header">
                <slot name="header">
                  <h5 class="modal-title">{settings.title}</h5>
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    onClick={(evt) => this.close()}
                  ></button>
                </slot>
              </div>
              <div class="modal-body">
                <slot></slot>
              </div>
              <div class="modal-footer">
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
