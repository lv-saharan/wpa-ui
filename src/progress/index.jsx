const { h, classNames, extractClass } = wpa
import uiBase from "../uiBase";
import { getCSSStyleSheets } from "../css";

export default class extends uiBase {
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
  };
  setValue(val) {
    this.$props.value = value;
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
