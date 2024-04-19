import uiBase,{ h, classNames } from "uiBase";
import { getCSSStyleSheets } from "../css";
 

/** @module Breadcrumb */

/**
 * @typedef {Object} Item
 * @property {string} label 导航标签
 * @property {string} [href]  导航链接
 */
   

/**
 * @typedef {Object} Props
 * @property {string|jsx} [divider] 分割线 如：/ 
 * @property {Array.<Item>} [items]  导航项
 */
   

 /**
 * @extends uiBase
 * @hideconstructor
 * @example 
 * <wp-breadcrumb items={items} divider="|" />
 * 
 * <wp-breadcrumb  items={items}   divider={<wp-icon name="keyboard_arrow_right" />} />
 */
export default class extends uiBase {
  static css = () => getCSSStyleSheets("reboot", "utilities", "breadcrumb");

  /**
   * @type Props
   */
  static defaultProps = {
    // divider: null,
  };
  static propTypes = {
    // divider: String,
  };
  css() {
    let { divider } = this.$props;
    if (typeof divider == "string") {
      return `:host{--wp-breadcrumb-divider:'${divider}'}`;
    }
    if (typeof divider == "object") {
      return `.breadcrumb-item + .breadcrumb-item::before{display:none}`;
    }
  }
  render() {
    let { items, divider } = this.$props;

    return (
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          {items.map((item, index) => {
            if (index !== items.length - 1) {
              return (
                <li class="breadcrumb-item">
                  {typeof divider == "object" && index != 0 ? divider : null}
                  <a href={item.href}>{item.label}</a>
                </li>
              );
            } else {
              return (
                <li class="breadcrumb-item active" aria-current="page">
                  {typeof divider == "object" && index != 0 ? divider : null}
                  {item.label}
                </li>
              );
            }
          })}
        </ol>
      </nav>
    );
  }
}
