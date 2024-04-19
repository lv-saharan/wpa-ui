import { h, render, define, Component, setTheme } from "uiBase";

/**
 * @module CSS
 * @desc 样式系统
 */

let BASE_ROOT = "bootstrap";
/**
 * 设置一个别的目录作为加载样式的根目录
 * @param {string} baseRoot 样式文件根目录 默认 bootstrap
 */
export function setBaseRoot(baseRoot) {
  BASE_ROOT = baseRoot;
  BASE_URL = new URL(`./${BASE_ROOT}/`, import.meta.url).href;
}

let BASE_URL = new URL(`./${BASE_ROOT}/`, import.meta.url).href;
/**
 * 这样可以在应用初始化的时候选择把样式目录指定到特定的服务地址
 * @param {string} baseUrl 样式基地址
 */
export function setBaseUrl(baseUrl) {
  BASE_URL = baseUrl;
}

/**
 * 加载指定根地址下的css
 * @param {string} css 样式名称 ,bootstrap 包含："accordion","alert","badge","breadcrumb","button-group","buttons","card","carousel","close","containers","dropdown","forms","grid","images","list-group","modal","nav","navbar","offcanvas","pagination","placeholders","popover","progress","reboot","root","scrollbar","spinners","tables","toasts","tooltip","transitions","utilities"
 * @param {string} [baseUrl] 样式基地址
 * @returns {string}
 * @ignore
 */
let loadStyleSheet = (css, baseUrl = BASE_URL) => {
  return fetch(getStyleSheetUrl(css, baseUrl))
    .then((r) => {
      if (r.ok) return r.text();
      console.error(`load stylesheet ${css} error`, r);
    })
    .catch((e) => {
      console.error(`load stylesheet ${css} error`, e);
      return null;
    });
};
/**
 * 默认都是通过fetch获取，也可以替换掉这种模式
 * @param {function} loader
 * @returns {function}
 */
export const setStyleSheetLoader = (loader) => (loadStyleSheet = loader);
/**
 * link rel 方式插入css,很少使用
 * @param {string} css
 * @param {HTMLElement|string} parent
 * @param {string} baseUrl
 * @ignore
 */
const addStyleSheet = (css, parent, baseUrl = BASE_URL) => {
  let $link = (
    <link rel="styleSheet" href={getStyleSheetUrl(css, baseUrl)}></link>
  );
  render($link, parent ?? "body");
};

/**
 * 引用重置样式
 * @param {HTMLElement|string} parent
 * @param {string} baseUrl
 * @ignore
 *
 */
const addRebootStyleSheet = (parent, baseUrl = BASE_URL) => {
  addStyleSheet("reboot", parent, baseUrl);
};
/**
 * 用基地址和css名称生成css完整路径
 * @param {string} css
 * @param {string} baseUrl
 * @returns {URL}
 * @ignore
 */
const getStyleSheetUrl = (css, baseUrl = BASE_URL) => {
  try {
    return new URL(`./${css}.css`, baseUrl).href;
  } catch (exc) {
    console.error(exc, css, baseUrl);
  }
};

const CSSStyleSheetMap = new Map();

/**
 * 获取指定的css文件
 * @async
 * @param {string} css
 * @param {string} baseUrl
 * @returns {CSSStyleSheet}
 */
export const getCSSStyleSheet = async (css, baseUrl = BASE_URL) => {
  let key = `${baseUrl}/${css}`;
  let cssss = CSSStyleSheetMap.get(key);

  if (cssss === undefined) {
    const resolves = [];
    CSSStyleSheetMap.set(key, resolves);
    cssss = new CSSStyleSheet();
    try {
      cssss.replaceSync(await loadStyleSheet(css, baseUrl));
      resolves.forEach((resolve) => {
        resolve(cssss);
      });
      CSSStyleSheetMap.set(key, cssss);
    } catch (e) {
      console.error("get css stylesheets error", e);
    }
  } else if (cssss instanceof Array) {
    //多线程！
    return new Promise((resolve) => {
      cssss.push(resolve);
    });
  }

  return cssss;
};

/**
 * 获取多个css文件
 * @async
 * @param  {...string} csses
 * @returns {Array.<CSSStyleSheet>}
 */
export const getCSSStyleSheets = (...csses) => {
  return Promise.all(csses.map((css) => getCSSStyleSheet(css)));
};

import stylesheets from "../bootstrap/stylesheets";

/**
 * bootstrap 所有的样式单
 * @enum {string}
 */
export const CSSStyleSheets = {};
stylesheets.forEach((css) => {
  Object.defineProperty(CSSStyleSheets, css, {
    get: function () {
      return getCSSStyleSheet(css);
    },
  });
});

/**
 * 预加载样式
 * @param {Array.<string>} csses
 */
export const preLoad = (csses = stylesheets) => {
  csses.forEach((css) => {
    getCSSStyleSheet(css);
  });
};

/**
 * 使用主题样式
 * @param {string} theme 主题名称，通过约定规则加载
 * @param {string} [baseUrl]
 */
export const useTheme = async (theme, baseUrl = BASE_URL) => {
  let themeCSS = await loadStyleSheet(`theme.${theme}`, baseUrl);
  setTheme(themeCSS);
};

/**
 * @typedef {object} Setting
 * @property {string|Array.<string>} classNames
 * @property {number} duration
 * @property {number} delay
 * @property {function} [callback]
 */

/**
 * 随时间变化的样式方法
 * @param {HTMLElement} element
 * @param {Array.<Setting>} settings
 * @param {number} times
 */
export function timingClassNames(element, settings, times = 1) {
  if (
    settings instanceof Array &&
    settings.length &&
    typeof times == "number" &&
    element.classList
  ) {
    let totalRun = 0;

    let run = (preClasses = []) => {
      let index = totalRun % settings.length;

      let {
        classNames,
        duration = 0,
        delay = 0,
        callback = null,
      } = settings[index];

      setTimeout(() => {
        if (typeof classNames == "string") {
          classNames = classNames.split(" ").filter((s) => s != "");
        }
        element.classList.remove(...preClasses);
        element.classList.add(...classNames);
        if (callback) callback(element, classNames, duration, delay);
      }, delay * 1000);

      totalRun++;
      let runTimes = Math.floor(totalRun / settings.length);
      //执行够了就退出
      if (runTimes >= times) return;

      setTimeout(() => {
        run(classNames);
      }, (duration + delay) * 1000);
    };
    run();
  }
}
export default {
  StyleSheets: stylesheets,
  CSSStyleSheets,
  setBaseUrl,
  setBaseRoot,
  loadStyleSheet,
  setStyleSheetLoader,
  addStyleSheet,
  addRebootStyleSheet,
  getStyleSheetUrl,
  getCSSStyleSheet,
  getCSSStyleSheets,
  useTheme,
  timingClassNames,
  preLoad,
};
