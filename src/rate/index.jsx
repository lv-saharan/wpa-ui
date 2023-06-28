const { h, define, Component, classNames, render } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";
/**
 * 投票星样式
 * @enum {string}
 */
const STAR_TYPES = {
  STAR: "star",
  HALF: "star_half",
  BORDER: "star_border",
};

/**
 * @module Rate
 * @desc 投票组件
 * @example
  <wp-rate max-score="6" score="2" />
  <button>
    <wp-rate max-score="6" score="2.5" color="blue" size=".8" />
  </button>
  <h3>
    <wp-rate score="6" init-score="2.4" color="pink" /> pink rate
  </h3>
  <div>
    <wp-rate
      onRate={(e) => {
        alert(e.detail);
      }}
      score={1}
      rateable
      max-score="10"
      size="2"
      color="red"
    ></wp-rate>
  </div> 
*/

/**
 * @typedef {Object} Props
 * @property {boolean} rateable 只读 默认：false
 * @property {number} [maxScore] 最大值，默认:5
 * @property {number} score 分值
 * @property {string} color 颜色
 * @property {number} [size] 大小  rem的倍数
 */
export default class extends uiBase {
  static css = css;
  static defaultProps = {
    rateable: false,
    maxScore: 5,
    score: 0,
    color: null,
    size: 1,
  };
  static propTypes = {
    rateable: Boolean,
    maxScore: Number,
    score: Number,
    size: Number,
    color: String,
  };
  #tempScore = -1;
  /**
   * 当前分值
   */
  get rateScore() {
    return this.$props.score;
  }
  install() {
    this.#tempScore = this.$props.score;
  }
  /**
   * 设置分值
   * @param {number} score
   * @fires module:Rate#rate
   */
  rate(score) {
    /**
     * @event module:Rate#rate 打分
     * @prop {number} score  分值
     * @example
     *
     * <wp-pager onRate={evt=>{
     *    let score=evt.detail
     *    //do something
     * }} />
     */
    this.fire("rate", score);
    this.#tempScore = score;
    this.update$Props({ score });
  }

  render(props) {
    let settings = this.$props;
    let { maxScore, rateable, size, color } = settings;
    let stars = [];
    let score = this.#tempScore;
    for (let i = 0; i < maxScore; i++) {
      if (score - i >= 0.5) {
        stars.push(STAR_TYPES.STAR);
      } else if (score - i > 0) {
        stars.push(STAR_TYPES.HALF);
      } else {
        stars.push(STAR_TYPES.BORDER);
      }
    }

    return (
      <div class={classNames("rate-wrap", "rate-" + this.#tempScore)}>
        {stars.map((name, index) => {
          if (rateable) {
            return (
              <wp-icon
                name={name}
                size={size}
                color={color}
                className={name}
                onmouseenter={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.#tempScore = index + 1;
                  this.fire("tryRate", this.#tempScore);
                  this.lazyUpdate();
                }}
                onmouseleave={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.#tempScore = this.rateScore;
                  this.lazyUpdate();
                }}
                onclick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.rate(index + 1);
                }}
              />
            );
          } else {
            return (
              <wp-icon name={name} size={size} color={color} className={name} />
            );
          }
        })}
      </div>
    );
  }
}
