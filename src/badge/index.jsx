const { h, classNames, extractClass } = wpa;
import uiBase from "../uiBase";
import { getCSSStyleSheets } from "../css";



/** @module Badge */
 
/**
 * @typedef {Object} Props
 * @property {string} [text] 内容  badge内容，可以用子元素（slot）代替
 * @property {boolean} [desc]  是否可关闭
 * @property {number} [position] 位置 top|bottom|left|right|top-left|top-right|bottom-left|bottom-right
 * 
 */

 /**
 * @extends uiBase
 * @hideconstructor
 * @example 
 * 
 *  <button type="button" class="btn btn-primary position-relative">
            消息
            <wp-badge position="bottom-right" class="bg-danger">
              <span style="color:black">999</span>
            </wp-badge>
    </button>
 */
export default class extends uiBase {
  static css = () => getCSSStyleSheets("reboot", "utilities", "badge");

  static defaultProps = {
    text: "",
    desc: false,
    position: false,
    // divider: null,
  };
  static propTypes = {

  };
  css() {}
  render(props) {
    let { text, desc, position } = this.$props;
    let positions = position ? position.split("-") : [];
    return (
      <span
        {...extractClass(props, "badge", {
          "position-absolute": position,
          "top-0": positions.includes("top"),
          "start-100": positions.includes("right"),
          "start-0": positions.includes("left"),
          "top-100": positions.includes("bottom"),
          "translate-middle": position,
          "rounded-pill": position,
        })}
      >
        <slot>{text}</slot>
        {desc && <span class="visually-hidden">{desc}</span>}
      </span>
    );
  }
}
