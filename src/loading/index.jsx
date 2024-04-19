import uiBase, { h, classNames } from "uiBase";

const loadingCache = new Map();
/**
 * Loading效果
 * @readonly
 * @enum {string}
 */
const LoadingEffects = {
  ArrowCicle: "arrow-cicle",
  BallFall: "ball-fall",
  BallScale: "ball-scacle",
  Circle: "circle",
  Rectangle: "rectangle",
};
/**
 * @module Loadings
 * @desc Loading效果
 * @example
 <ol>
      <li>
        circle:
        <wp-loading name="circle" />
      </li>
      <li style="line-height:2rem;">
        circle: 大小不设定可以根据父元素大小确定
        <wp-loading name="circle" />
      </li>
      <li>
        circle: Size 1.5rem，使用rem倍数
        <wp-loading name="circle" size="1.5" color="red"/>
        <wp-loading name="circle" size="1.5" color="green"/>
        <wp-loading name="circle" size="1.5" color="blue"/>
        <wp-loading name="circle" size="1.5" color="pink"/>
      </li>
      <li>
        arrow circle:
        <wp-loading name="arrow-circle" />
      </li>
      <li>
        ball-scale:
        <wp-loading name="ball-scale" />
      </li>
      <li>
        ball-fall:
        <wp-loading name="ball-fall" />
      </li>
      <li>
        rectangle:
        <wp-loading name="rectangle" />
      </li>
    </ol>

*/

/**
 * @typedef {Object} Props
 * @property {string} [name] 效果名称 默认：circle
 * @property {number} [size] 大小 默认随父组件高度
 * @property {string} [color] 颜色 可以通过 --wp-loading-color 全局设定
 */

export default class extends uiBase {
  static updateOnAttributeChanged = true;
  static css = `
    :host{
      display:inline-block;
    }
  `;
  static defaultProps = {
    name: "circle",
    size: null,
    color: null,
  };
  static propTypes = {
    name: String,
    size: Number,
    color: String,
  };

  /**
   * Loading效果
   * @type {LoadingEffects}
   */
  static get loadingEffects() {
    return LoadingEffects;
  }
  #css;

  css() {
    let { size, color } = this.$props;
    let loadingSize = "2rem";

    if (!size) {
      let parent = this.parentNode?.host ?? this.parentNode;
      if (parent) loadingSize = `${parent.offsetHeight}px`;
      else {
        loadingSize = "2rem";
      }
    } else {
      loadingSize = `${size}rem`;
    }
    let sizeCSS = `
    :host{
      --wp-loading-size:${loadingSize};
    }
    `;

    let colorCSS = "";
    if (color) {
      colorCSS = `
      :host {
        --wp-loading-color:${color};
      }
      `;
    }
    return `
    ${this.#css}
    ${sizeCSS}
    ${colorCSS}
    `;
  }

  async getLoadingConfig() {
    let { name } = this.$props;
    const key = name;
    let loadingConfig = loadingCache.get(key);
    if (loadingConfig == undefined) {
      loadingConfig = [];
      loadingCache.set(key, loadingConfig);
      try {
        const { default: config } = await import(`./loadings/${name}.js`);
        loadingCache.set(key, config);
        for (let { resolve } of loadingConfig) {
          resolve(config);
        }
        return config;
      } catch {
        // console.info("icon load error", type, name)
        loadingCache.set(key, null);
        for (let { resolve } of loadingConfig) {
          resolve(null);
        }
        return null;
      }
    }
    if (loadingConfig instanceof Array) {
      return new Promise((resolve, reject) => {
        loadingConfig.push({ resolve, reject });
      });
    }
    return loadingConfig;
  }
  async render() {
    const { template, css } = await this.getLoadingConfig();
    this.#css = css;
    return template;
  }
}
