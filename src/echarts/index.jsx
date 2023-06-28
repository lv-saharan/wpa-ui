const { h, classNames, extractClass } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";
let root = new URL(`./echarts/`, import.meta.url).href;
let jsFile = "echarts.esm.min.js";
let ECharts = null;

/** 
 * @module Echarts 
 * @desc 图表组件
*/

  

/**
 * @typedef {Object} Props
 * @property {string|jsx} [title] 标题 
 * @property {string} [tooltip]  鼠标提示
 * @property {Array} legend   示例
 * @property {Object} [xAxis]   
 * @property {Object} [yAxis]   
 * @property {Array} series  数据
 * @property {number} width  宽
 * @property {number} height  高
 * 
 */
   

 /**
 * @extends uiBase
 * @hideconstructor
 * @example 

 {@link https://echarts.apache.org/zh/index.html|Echarts Demos}

var option = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  legend: {
    data: ["销量"],
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

<wp-echarts props={option} style="height:200px"></wp-echarts>
 * 
 * 
 */
export default class extends uiBase {
  static css = css;
  static propTypes = {};
  /**
   * @type {Props}
   */
  static defaultProps = {
    title: null,
    tooltip: null,
    legend: [],
    xAxis: null,
    yAxis: null,
    series: [],
    width: null,
    height: null,
  };

  static get root() {
    return root;
  }
  static set root(value) {
    root = value;
  }
  static get jsFile() {
    return jsFile;
  }
  static set jsFile(value) {
    jsFile = value;
  }

  #echart;
  get echart() {
    return this.#echart;
  }
  async installed() {
    let echarts = ECharts;
    if (!echarts) {
      echarts = ECharts = await import(
        new URL(this.constructor.jsFile, this.constructor.root).href
      );
    }
    this.#echart = echarts.init(this.$("main"));
    this.draw();
  }

  /**
   * 绘制图表
   */
  draw() {
    this.echart.setOption(this.$props);
  }

  updated() {
    this.draw();
  }
  render() {
    return <main />;
  }
}
