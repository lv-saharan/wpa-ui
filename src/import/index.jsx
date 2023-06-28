const { h, classNames, uniqueTag } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";

/**
 * @module Import
 * @desc JS导入组件
 * @example
 <wp-import src={new URL("../remote/index.js", import.meta.url).href} module="welcome" />
 <hr />
 <wp-import src={new URL("../remote/index.js", import.meta.url).href} module="user" />
 */

/**
 * @typedef {Object} Props
 * @property {string} src 导入源地址 
 * @property {string} [module] 导入模块，默认:default
 * @property {jsx} [loading] 加载样式
 * @property {jsx } [loadError] 加载错误样式
 */

export default class extends uiBase {
  static css = [css];
  /**
   * @type {Props}
   */
  static defaultProps = {
    src: null,
    module: "default",
    loading: <wp-loading size="6" />,
    loadError: <h1>Module Load Error</h1>,
  };
  static propTypes = {
    src: String,
    module: String,
  };
  #module;
  get $module() {
    return this.#module;
  }
  /**
   * 加载模块
   * @param {string} src 
   * @param {string} module 
   * @param {jsx} loading 
   * @param {jsx} loadError 
   */
  load(src, module, loading, loadError) {
    module = module ?? this.$props.module;
    loading = loading ?? this.$props.loading;
    loadError = loadError ?? this.$props.loadError;
    this.#module = loading;

    if (src && module) {
      import(src)
        .then((modules) => {
          let $module = modules[module];
          if ($module == undefined) {
            this.#module = loadError;
          } else if (typeof $module === "function") {
            const App = uniqueTag($module);
            this.#module = <App />;
          } else {
            this.#module = $module;
          }
          this.updateSelf();
        })
        .catch((exc) => {
          console.error("import module error！", src, module, exc);
          this.#module = loadError;
          this.updateSelf();
        });
    }
  }
  /**
   * 重新加载
   */
  reload(){
    let { src, module, loading, loadError } = this.$props;
    this.load(src, module, loading, loadError);
  }
  install() {
   this.reload()
  }
  render(props) {
    return this.#module;
  }
}
