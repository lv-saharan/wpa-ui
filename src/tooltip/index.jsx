const { h, classNames, createRef } = wpa
import { getCSSStyleSheets } from "../css";
import css from "./index.scss";
import popover from "../popover";


/**
 * @module Tooltip
 * @desc 小提示
 * @example
  <wp-tooltip placement="right">
    <button class="btn  btn-primary">作為父組件的子組件</button>
    <div slot="body">
      this is a tip And here's some amazing content. It's very engaging.
      Right?
    </div>
  </wp-tooltip>

*/
 
/**
 * 小提示
 * @extends module:Popover
 * @hideconstructor
 */
export default class extends popover {
  static css = [
    () => getCSSStyleSheets("reboot", "utilities", "transitions", "tooltip"),
    css,
  ];
  static defaultProps = { ...super.defaultProps, offset: 0 };
  get type() {
    return "tooltip";
  }
  render(props) {
    let { placement, body } = this.$props;
    return (
      <>
        <slot ref={this.slotRef}></slot>
        <div
          class="tooltip bs-tooltip-auto fade"
          role="tooltip"
          data-popper-placement={placement}
        >
          <div class="tooltip-arrow"></div>
          <slot class="tooltip-inner" name="body">
            {body}
          </slot>
        </div>
      </>
    );
  }
}
