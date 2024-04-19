import uiBase ,{ h, classNames,createRef, extractClass }from "uiBase";
import { getCSSStyleSheets } from "../css";

/**
 * @module Progress
 * @desc 进度条
 * @example
  <wp-progress value={this.percent} style="height:1px;width:200px"></wp-progress>
  <hr />
  <wp-progress value={this.percent} class="bg-success"></wp-progress>
  <hr />
  <wp-progress value={this.percent} class="bg-danger" striped></wp-progress>
  <hr />
  <wp-progress value={this.percent} class="bg-danger" striped animated></wp-progress>
   
*/

/**
 * @typedef {Object} Props
 * @property {string} [label] aria-label
 * @property {number} value 值 min~max 之间
 * @property {number} [min] 最小值 默认：0
 * @property {number } [max] 最大值 默认：100
 * @property {number } [height] 高度 @todo 没有实现 
 * @property {boolean } [showPercent] 显示百分比 默认：false
 * @property {boolean } [striped] striped 风格 默认：false
 * @property {boolean } [animated] 动画效果 默认：false
 * @property {string } [className] 样式名称 参考bootstrap样式
 */
export default class extends uiBase {
  static updateOnAttributeChanged = true;
  static css = () => getCSSStyleSheets("reboot", "utilities", "progress");

  static defaultProps = {
    label: false,
    value: 0,
    min: 0,
    max: 100,
    height: false,
    showPercent: false,
    striped: false,
    animated: false,
    className: null,
  };
  static propTypes = {
    label: String,
    value: Number,
    min: Number,
    max: Number,
    height: String,
    showPercent: Boolean,
    striped: Boolean,
    animated: Boolean,
    className: String,
  };
  /**
   * 设置值
   */
  set value(val) {
    this.$props.value = val;
    this.update();
  }
  /**
   * 当前值
   */
  get value() {
    return this.$props.value;
  }
  setValue(val) {
    this.$props.value = val;
    this.update();
  }
  css() {}
  render(props) {
    let {
      label,
      value,
      min,
      max,
      showPercent,
      striped,
      animated,
      style,
      className,
    } = this.$props;
    return (
      <div class="progress" style={style}>
        <div
          class={classNames("progress-bar", props.class ?? props.className, {
            "progress-bar-striped": striped,
            "progress-bar-animated": animated,
          })}
          role="progressbar"
          aria-label={label}
          style={{ width: `${value}%` }}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        >
          {showPercent && <span>{value}%</span>}
        </div>
      </div>
    );
  }
}
