import uiBase,{ h, classNames, extractClass, createRef } from "uiBase";
import { getCSSStyleSheets } from "../css";
import effect from "../effect";
import css from "./index.scss";

/**
 * @module Layout
 * @desc 布局组件
 * @example
 
 <wp-layout ref={this.layoutRef}>
          <div slot="header">
            <ul>
              <li>
                <wp-icon name="code" />
              </li>
              <li>文件</li>
              <li>编辑</li>
              <li>选择</li>
              <li>查看</li>
            </ul>
            <div
              class="position-absolute  top-100 start-50 translate-middle-x"
              style={{ "z-index": 1 }}
            >
              <button
                onClick={(evt) => {
                  this.layoutRef.current.toggleHeader();
                }}
              >
                close header
              </button>
            </div>
          </div>
          <div slot="content">内容部分！</div>
          <div slot="left">
            <ul>
              {Array.from({ length: 120 }).map((v, index) => (
                <li>menu : {index + 1}</li>
              ))}
            </ul>
            <div class="tools">
              <ul>
                <li>
                  <wp-icon
                    name="file_copy"
                    onClick={(evt) => {
                      this.layoutRef.current.toggleLeft();
                    }}
                  />
                </li>
                <li>
                  <wp-icon name="search" />
                </li>
                <li>
                  <wp-icon name="lock_person" />
                </li>
                <li>
                  <wp-icon name="access_alarm" />
                </li>
                <li>
                  <wp-icon name="adf_scanner" />
                </li>
                <li>
                  <wp-icon name="apps" />
                </li>
              </ul>
            </div>
          </div>
          <div slot="right">
            <ul>
              {Array.from({ length: 120 }).map((v, index) => (
                <li>menu : {index + 1}</li>
              ))}
            </ul>
            <div
              class="position-absolute top-50 end-100 translate-middle-y"
              style="z-index:10"
            >
              <button
                onClick={(evt) => {
                  this.layoutRef.current.toggleRight();
                }}
              >
                close right
              </button>
            </div>
          </div>
        </wp-layout>
        
*/

/**
 * @typedef {Object} Props
 * @property {boolean} [openFooter] 展开Footer Pane
 * @property {boolean} [openHeader] 展开Header Pane
 * @property {boolean} [openLeft] 展开Left Pane
 * @property {boolean } [openRight] 展开Right Pane
 * @property {number } [duration] 动画时间
 */
export default class extends uiBase {
  static css = [css];
  static defaultProps = {
    openFooter: true,
    openHeader: true,
    openLeft: true,
    openRight: true,
    duration: 0.35,
  };
  static propTypes = {
    openFooter: Boolean,
    openHeader: Boolean,
    openLeft: Boolean,
    openRight: Boolean,
  };

  #headerRef = createRef();
  #mainRef = createRef();
  #footerRef = createRef();
  #leftRef = createRef();
  #rightRef = createRef();
  #contentRef = createRef();

  close(element, dir) {}

  /**
   * 关闭Footer Pane
   */
  closeFooter() {
    this.$props.openFooter = false;
    effect.collapse.hide(this.#footerRef.current);
    this.#mainRef.current.style.height =
      this.clientHeight - this.#headerRef.current.clientHeight + "px";
  }
  /**
   * 展开Footer Pane
   */
  openFooter() {
    this.$props.openFooter = true;
    effect.collapse.show(this.#footerRef.current);
    this.#mainRef.current.style.height =
      this.clientHeight -
      this.#headerRef.current.clientHeight -
      this.#footerRef.current.scrollHeight +
      "px";
  }
  /**
   * 切换Footer Pane状态
   */
  toggleFooter() {
    if (this.$props.openFooter) this.closeFooter();
    else this.openFooter();
  }
  /**
   * 关闭Header Pane
   */
  closeHeader() {
    this.$props.openHeader = false;
    effect.collapse.hide(this.#headerRef.current);
    this.#mainRef.current.style.height =
      this.clientHeight - this.#footerRef.current.clientHeight + "px";
  }
  /**
   * 展开Header Pane
   */
  openHeader() {
    this.$props.openHeader = true;
    effect.collapse.show(this.#headerRef.current);
    this.#mainRef.current.style.height =
      this.clientHeight -
      this.#headerRef.current.scrollHeight -
      this.#footerRef.current.clientHeight +
      "px";
  }
  /**
   * 切换Header Pane状态
   */
  toggleHeader() {
    if (this.$props.openHeader) this.closeHeader();
    else this.openHeader();
  }

  /**
   * 关闭Left Pane
   */
  closeLeft() {
    this.$props.openLeft = false;
    effect.collapse.hide(this.#leftRef.current);
  }
  /**
   * 展开Left Pane
   */
  openLeft() {
    this.$props.openLeft = true;
    effect.collapse.show(this.#leftRef.current);
  }
  /**
   * 切换Left Pane状态
   */
  toggleLeft() {
    if (this.$props.openLeft) this.closeLeft();
    else this.openLeft();
  }
  /**
   * 关闭Right Pane
   */
  closeRight() {
    this.$props.openRight = false;
    effect.collapse.hide(this.#rightRef.current);
  }
  /**
   * 展开Right Pane
   */
  openRight() {
    this.$props.openRight = true;
    effect.collapse.show(this.#rightRef.current);
  }
  /**
   * 切换Right Pane状态
   */
  toggleRight() {
    if (this.$props.openRight) this.closeRight();
    else this.openRight();
  }
  /**
   * 重新绘制
   */
  resize() {
    let rect = this.getBoundingClientRect();
    let headerRect = this.#headerRef.current.getBoundingClientRect();
    let footerRect = this.#footerRef.current.getBoundingClientRect();
    this.#mainRef.current.style.height =
      rect.height - headerRect.height - footerRect.height + "px";
  }
  installed() {
    //installed 有时候因为样式异步会提前执行

    const { openFooter, openHeader, openLeft, openRight } = this.$props;
    if (!openFooter) this.#footerRef.current.style.height = 0;
    if (!openHeader) this.#headerRef.current.style.height = 0;
    if (!openLeft) this.#leftRef.current.style.height = 0;
    if (!openRight) this.#rightRef.current.style.height = 0;

    this.resize();
    // setTimeout(() => {
    //     this.resize()
    // }, 10);
    window.addEventListener(
      "resize",
      (evt) => {
        // console.log(evt)
        this.resize();
      },
      true
    );
  }
  render(props) {
    return (
      <>
        <slot name="header" ref={this.#headerRef}></slot>
        <main ref={this.#mainRef}>
          <slot
            name="left"
            ref={this.#leftRef}
            class="collapse-horizontal"
          ></slot>
          <slot name="content" ref={this.#contentRef}></slot>
          <slot
            name="right"
            ref={this.#rightRef}
            class="collapse-horizontal"
          ></slot>
        </main>
        <slot name="footer" ref={this.#footerRef}></slot>
      </>
    );
  }
}
