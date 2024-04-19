import uiBase , { h, classNames,createRef, extractClass } from "uiBase";
import { computePosition, flip, arrow, shift, offset } from "@floating-ui/dom";
import { getCSSStyleSheets } from "../css";
import css from "./index.scss";
import effect from "../effect";


/**
 *@module Popover 
 *@desc 弹出组件
 *@example
 <wp-popover
    placement="right"
    css={`
      .popover {
        --wp-popover-bg: black;
      }

      .popover-body {
        --wp-popover-body-color: white;
        width: 20rem;
      }
    `}
  >
    <button class="btn  btn-primary">slot 一个button</button>

    <div slot="body">
      this is a tip And here's some amazing content. It's very engaging.
      Right?
    </div>
  </wp-popover>

  <wp-popover
    placement="right"
    header="test"
    body={
      <p style="width:20rem;">
        hello....，Each of these base placements has an alignment in the
        form -start and -end. For example, 'right-start', or
        'bottom-end'. These allow you to align the tooltip to the edges
        of the button, rather than centering it
      </p>
    }
  >
    <button class="btn  btn-primary">slot 一个button2 </button>
  </wp-popover>
*/
 
   

/**
 * @typedef {Object} Props
 * @property {string} [placement] 位置 如： top-start ,top-end , right, right-start, right-end , bottom , bottom-start, bottom-end , left, left-start, left-end
 * @property {HTMLElement|string} [reference]  触发元素
 * @property {jsx} [header]  标题部分 支持slot=header
 * @property {jsx} [body]  内容部分 支持slot=body
 * @property {string} [strategy]  定位方式 默认： fixed ；absolute | fixed;
 * @property {number} [offset]  偏移量 默认：6
 * @property {string} [triggerShow]  显示事件 默认：mouseenter focus
 * @property {string} [triggerHide]  隐藏事件 默认：mouseleave blur
 * 
 */
   

export default class extends uiBase {
  static css = [
    () => getCSSStyleSheets("reboot", "utilities", "transitions", "popover"),
    css,
  ];
  static defaultProps = {
    header: null,
    body: null,
    reference: null, //哪個對象？
    strategy: "fixed", //'absolute' | 'fixed';
    placement: "bottom",
    triggerShow: "mouseenter focus", //mouseenter focus click
    triggerHide: "mouseleave blur", //mouseleave blur click
    offset: 6,
  };
  static propTypes = {
    strategy: String,
    placement: String,
    trigger: String,
    offset: Number,
  };
  get type() {
    return "popover";
  }
  get $element() {
    return this.$(`.${this.type}`);
  }
  slotRef = createRef();
  get #$slot() {
    return this.slotRef.current;
  }
  get #$reference() {
    //检查slot下面有元素吗？使用第一个元素作为参考元素
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
    let reference = this.#$reference;
    if (reference) {
      let $arrow = this.$(`.${this.type}-arrow`);
      computePosition(reference, this.$element, {
        strategy,
        placement,
        middleware: [
          flip(),
          shift(),
          offset(_offset),
          arrow({ element: $arrow }),
        ],
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(this.$element.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        // Accessing the data
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]];

        $arrow &&
          Object.assign($arrow.style, {
            left: arrowX != null ? `${arrowX}px` : "",
            top: arrowY != null ? `${arrowY}px` : "",
            right: "",
            bottom: "",
          });
        let popoverDataset = this.$element.dataset;
        if (staticSide == "top") {
          popoverDataset.popperPlacement = "bottom";
        } else if (staticSide == "bottom") {
          popoverDataset.popperPlacement = "top";
        } else if (staticSide == "left") {
          popoverDataset.popperPlacement = "right";
        } else if (staticSide == "right") {
          popoverDataset.popperPlacement = "left";
        }
      });
    }
  }
  #visible = false;
  /**
   * 显示
   */
  show() {
    this.#visible = true;
    Object.assign(this.$element.style, {
      display: "block",
      position: this.$props.strategy,
    });
    this.setPosition();
    effect.fade.show(this.$element);
  }
   /**
   * 隐藏
   */
  hide() {
    this.#visible = false;
    effect.fade.hide(this.$element);
    Object.assign(this.$element.style, {
      display: "none",
    });
  }
  /**
   * 切换（隐藏|显示） 
   */
  toggle() {
    if (this.#visible) this.hide();
    else {
      this.show();
    }
  }

  installed() {
    const reference = this.#$reference;
    const { triggerShow, triggerHide } = this.$props;
    if (reference) {
      triggerShow.split(" ").forEach((trigger) => {
        if (trigger) {
          reference.addEventListener(trigger, (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.show();
          });
        }
      });
      triggerHide.split(" ").forEach((trigger) => {
        if (trigger) {
          reference.addEventListener(trigger, (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.#visible) this.hide();
          });
        }
      });
    }
  }
  render(props) {
    let { placement, header, body } = this.$props;
    return (
      <>
        <slot ref={this.slotRef} tabIndex></slot>
        <div
          class="popover bs-popover-auto fade"
          role="tooltip"
          data-popper-placement={placement}
        >
          <div class="popover-arrow"></div>
          <slot name="header" class="popover-header">
            {header}
          </slot>
          <slot class="popover-body" name="body">
            {body}
          </slot>
        </div>
      </>
    );
  }
}
