const { h, classNames, uniqueTag } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";
export default class extends uiBase {
  static css = [css];
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
  install() {
    let { src, module, loading, loadError } = this.$props;
    this.load(src, module, loading, loadError);
  }
  render(props) {
    return this.#module;
  }
}
