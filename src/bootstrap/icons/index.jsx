const { h } = wpa;

import uiBase from "../../uiBase";

const iconsCache = new Map();

const loadIcon = async (name) => {
  try {
    const key = name;
    let cachedIcon = iconsCache.get(key);
    if (cachedIcon == undefined) {
      cachedIcon = {
        icon: false,
        resolves: [],
      };
      iconsCache.set(key, cachedIcon);
      try {
        const { default: icon } = await import(`./bootstrap/icons/${name}.js`);
        cachedIcon.icon = icon;
      } catch {
        // console.info("icon load error", type, name)
        cachedIcon.icon = null;
      }
      for (let resolve of cachedIcon.resolves) {
        resolve(cachedIcon.icon);
      }
      cachedIcon.resolves = [];
      return cachedIcon.icon;
    }

    if (cachedIcon.icon === false) {
      return new Promise((resolve, reject) => {
        cachedIcon.resolves.push(resolve);
      });
    }
    return cachedIcon.icon;
    // const { default: icon } = await import(`./bootstrap/icons/${name}.js`);
    // return icon;
  } catch {
    console.error("load icon error", name);
    return null;
  }
};
const createSvg = async (name, props = {}) => {
  let icon = await loadIcon(name);
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      part: "svg",
      ...props,
    },
    icon
  );
};
export default class extends uiBase {
  static updateOnAttributeChanged = true;
  static propTypes = {
    name: String,
    viewBox: Number,
    size: Number,
    color: String,
  };

  static defaultProps = {
    name: null,
    viewBox: 16,
    size: null,
    color: null,
  };
  static createSvg = createSvg;
  static loadIcon = loadIcon;
  static css = `
    :host{
      vertical-align:var(--wp-bicon-valign,middle) ;
    }
    svg{
      vertical-align:var(--wp-bicon-valign,middle) ;
    }
  `;

  css() {
    let { size, color } = this.$props;
    let fill = color ? color : "var(--wp-bi-color)";
    let width = size ? `${size}rem` : "var(--wp-bi-width, 1rem)";
    let height = size ? `${size}rem` : "var(--wp-bi-height, 1rem);";
    return `
      :host svg{
        fill: ${fill} ;
        width: ${width};
        height: ${height};
      }
    `;
  }
  async render() {
    let { name, viewBox } = this.$props;
    let $icon = await loadIcon(name);

    return (
      <svg
        part="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={"0 0 " + viewBox + " " + viewBox}
      >
        {$icon}
      </svg>
    );
  }
}
