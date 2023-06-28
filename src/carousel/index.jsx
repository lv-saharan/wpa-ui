const { h, classNames, extractClass } = wpa;
import uiBase from "../uiBase";
import { getCSSStyleSheets, timingClassNames } from "../css";
import css from "./index.scss";
import { isVisible, triggerTransitionEnd } from "bootstrap/js/src/util";
import { reflow } from "../utils";
const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ACTIVE = "active";
const CLASS_NAME_SLIDE = "slide";
const CLASS_NAME_END = "carousel-item-end";
const CLASS_NAME_START = "carousel-item-start";
const CLASS_NAME_NEXT = "carousel-item-next";
const CLASS_NAME_PREV = "carousel-item-prev";

const SELECTOR_ACTIVE = ".active";
const SELECTOR_ITEM = ".carousel-item";
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;


/** 
 * @module Carousel 
 * @todo 需要支持垂直方向的动画
*/

  

/**
 * @typedef {Object} Props
 * @property {boolean} [autoSlide] 自动播放 默认：true 
 * @property {string} [pauseEvent]  暂停事件 默认：hover
 * @property {number} [interval]  播放间隔 默认：2.3s
 * @property {number} [duration]  动画时长 默认：0.6s
 * @property {Array.<jsx>} items  幻灯内容 
 * @property {function} [prevCtrl]  向前的按钮
 * @property {function} [nextCtrl]  向后的按钮
 * @property {function} [indicator]  导航按钮
 * 
 */
   

 /**
 * @extends uiBase
 * @hideconstructor
 * @example 
 * 
   <wp-carousel
      style="width:20rem; outline:#00FF00 dotted thick;"
      duration=".3"
      items={
        <>
          <img
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.gAwrrAwnrp1bDE8Z-1ibmQHaJU?w=134&h=180&c=7&r=0&o=5&dpr=2.07&pid=1.7"
            class="d-block w-100"
            alt="...1"
          />
          <img
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.gAwrrAwnrp1bDE8Z-1ibmQHaJU?w=134&h=180&c=7&r=0&o=5&dpr=2.07&pid=1.7"
            class="d-block w-100"
            alt="...2"
            waiting="5"
          />
          <img
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.gAwrrAwnrp1bDE8Z-1ibmQHaJU?w=134&h=180&c=7&r=0&o=5&dpr=2.07&pid=1.7"
            class="d-block w-100"
            alt="...3"
          />
        </>
      }
    ></wp-carousel>
 * 
 * 
 */
export default class extends uiBase {
  static css = [
    () => getCSSStyleSheets("reboot", "utilities", "carousel"),
    css,
  ];

  static defaultProps = {
    autoSlide: true,
    pauseEvent: "hover",
    interval: 2.3,
    duration: 0.6, //动画时长
    items: [],
    prevCtrl: (host) => (
      <button
        class="carousel-control-prev"
        type="button"
        onClick={(evt) => {
          host.slide(false);
        }}
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
    ),
    nextCtrl: (host) => (
      <button
        class="carousel-control-next"
        type="button"
        onClick={(evt) => {
          host.slide();
        }}
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    ),
    indicator: ({ index, host }) => (
      <button
        type="button"
        onClick={(evt) => host.slide(index)}
        class={classNames({ active: index == 0 })}
      ></button>
    ),
  };
  static propTypes = {
    autoSlide: Boolean,
    interval: Number,
    duration: Number,
    pauseEvent: String,
  };

  css() {
    return `
    .carousel-item {
      transition-duration: ${this.$props.duration}s;
    }
    `;
  }
  #activeIndex = 0;
  /**
   * activeIndex
   */
  get activeIndex() {
    return this.#activeIndex;
  }
  #isSliding = false;
  /**
   * 是否播放中
   */
  get isSliding() {
    return this.#isSliding;
  }
  /**
   * 所有播放项
   */
  get $items() {
    return this.$$(".carousel-item");
  }
  /**
   * 激活项
   */
  get $activeItem() {
    return this.$(".carousel-item.active");
  }
  /**
   * 暂停
   */
  pause() {
    if (this.#isSliding) {
      triggerTransitionEnd(this);
    }

    clearInterval(this.#interval);
    this.#interval = null;
  }

  /**
   * 导航列表
   * @type {Array.<HTMLElement>}
   */
  get indicators() {
    return [...this.$("slot[name=indicators]").children];
  }
  #slideQueue = [];
  /**
   * 播放指定项
   * @param {HTMLElement|number|boolean} isNext 
   */
  slide(isNext = true) {
    //boolean,number,element
    if (this.#isSliding) return false;

    let {
      $activeItem,
      $items,
      $props: { duration },
    } = this;

    let activeIndex = $items.indexOf($activeItem);
    let nextIndex, $nextItem;
    if (isNext instanceof HTMLElement) {
      $nextItem = isNext;
      nextIndex = $items.indexOf($nextItem);
      isNext = nextIndex > activeIndex;
    } else if (typeof isNext == "number") {
      nextIndex = (isNext + $items.length) % $items.length;
      $nextItem = $items[nextIndex];
      isNext = nextIndex > activeIndex;
    } else {
      nextIndex = (activeIndex + 1) % $items.length;
      if (!isNext) {
        nextIndex = (activeIndex - 1 + $items.length) % $items.length;
      }
      $nextItem = $items[nextIndex];
    }

    if (this.#activeIndex == nextIndex) return false;
    let directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    let orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

    this.#isSliding = true;

    let waiting = Number.parseFloat($activeItem.getAttribute("waiting")) ?? 0;

    timingClassNames($nextItem, [
      {
        classNames: [],
        duration: waiting,
      },
      {
        classNames: [orderClassName],
        callback: () => {
          reflow($nextItem);
        },
      },
      {
        classNames: [orderClassName, directionalClassName],
        duration,
      },
      {
        classNames: ["active"],
        callback: () => {
          this.indicators.forEach((indicator, index) => {
            if (nextIndex == index) {
              indicator.classList.add("active");
            } else {
              indicator.classList.remove("active");
            }
          });
        },
      },
    ]);

    timingClassNames($activeItem, [
      {
        classNames: [],
        duration: waiting,
      },
      {
        classNames: [directionalClassName, "active"],
        duration,
      },
      {
        classNames: [],
        callback: () => {
          this.#isSliding = false;
          this.#activeIndex = nextIndex;

          let func;
          while ((func = this.#slideQueue.pop())) {
            func();
          }
        },
      },
    ]);
  }
  nextWhenVisible() {
    if (!document.hidden && isVisible(this)) {
      this.slide();
    }
  }
  #interval;
  /**
   * 循环播放
   */
  cycle() {
    if (this.#interval) clearInterval(this.#interval);
    this.#interval = setInterval(
      () => this.nextWhenVisible(),
      this.$props.interval * 1000
    );
  }
  installed() {
    let $items = this.$items;
    if (!this.$activeItem && $items.length > 0) {
      $items[0].classList.add("active");
    }

    this.#activeIndex = $items.indexOf(this.$activeItem);

    if (this.$props.autoSlide && this.$activeItem) {
      this.cycle();
    }
    this.addEventListener("mouseenter", () => {
      this.pause();
    });
    this.addEventListener("mouseleave", () => {
      if (this.$props.autoSlide) {
        if (this.#isSliding) {
          this.#slideQueue.push(() => {
            this.cycle();
          });
        } else {
          this.cycle();
        }
      }
    });
  }
  render(props) {
    let { items, nextCtrl, prevCtrl, indicator } = this.$props;
    return (
      <div {...extractClass(props, "carousel")}>
        <slot class="carousel-inner">
          {items.map((item) => (
            <div
              className={classNames("carousel-item")}
              waiting={item.attributes?.waiting}
            >
              {item}
            </div>
          ))}
        </slot>

        <div class="carousel-indicators">
          <slot name="indicators">
            {typeof indicator == "function" &&
              items.map((item, index) =>
                indicator({ item, index, host: this })
              )}
          </slot>
        </div>

        <slot name="actions">
          {typeof nextCtrl == "function" && nextCtrl(this)}
          {typeof prevCtrl == "function" && prevCtrl(this)}
        </slot>
      </div>
    );
  }
}
