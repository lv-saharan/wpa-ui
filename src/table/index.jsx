import uiBase, { h, classNames, createRef, extractClass } from "uiBase";
import { getCSSStyleSheets } from "../css";
import css from "./index.scss";

/**
 * @module Table
 * @desc 表格组件
 * @example
const rows   = Array.from({ length: 20 }).map((v, index) => {
  return {
    id: index,
    name:
      index == 10 ? (
        <b style={{ color: "red" }}>{"user-" + index}</b>
      ) : (
        "user-" + index
      ),
  };
});
const columns = [
  {
    type: "checkbox",
    field: "id",
    checked: [1, 2, 3],
  },
  {
    type: "index",
    title: "序号",
    style: {
      width: "2em",
      color: "blue",
    },
    titleStyle: {
      color: "red",
      "white-space": "nowrap",
    },
  },
  {
    field: "id",
  },
  { field: "name", title: "姓名" },
];
<wp-table class="table-hover" columns={columns} rows={rows} />

*/

/**
 * @typedef {Object} Column
 * @property {jsx} title 标题
 * @property {string} field 字段
 * @property {string} [type] 列样式 如：normal,checkbox,radio,index
 * @property {Object} style 数据项样式 如：{color:red,...}
 * @property {Object} titleStyle 标题项样式  如：{color:red,...}
 *
 */

/**
 * @typedef {Object} Props
 * @property {Array} rows 数据源
 * @property {Array.<Column>} columns 列定义
 * @property {boolean} [showHeader] 显示标题行
 * @property {function } [titleCellFormatter] 标题格式化方法
 * @property {function } [dataCellFormatter] 数据项格式化方法
 */

export default class extends uiBase {
  static css = [() => getCSSStyleSheets("reboot", "utilities", "tables"), css];

  /**
   * @type {Props}
   */
  static defaultProps = {
    rows: [],
    /**
     * {title,field，type,style,titleStyle,sort}
     * type:normal,checkbox,radio,index,
     * {
     *  type:"checkbox",
     *  field:"id",
     *  checked:[]
     *
     * }
     * 支持多种主键
     */
    columns: [],
    //显示header
    showHeader: true,
    titleCellFormatter(col, cols, rows, host) {
      if (col.type == "checkbox") {
        if (!col.checked) {
          col.checked = [];
        }
        const rowKeys = rows?.map((row) => row[col.field]) ?? [];
        const checked = rowKeys.every((key) => col.checked.includes(key));
        return (
          <input
            type="checkbox"
            data-field={col.field}
            checked={checked}
            onChange={async (evt) => {
              if (evt.target.checked) {
                //checkall
                col.checked.push(...rowKeys);
                const checkedKeys = [...new Set(col.checked)];
                col.checked.splice(0, col.checked.length, ...checkedKeys);
              } else {
                const all = new Set(col.checked);
                const rest = new Set(rowKeys.filter((key) => !all.has(key)));
                col.checked.splice(0, col.checked.length, ...rest);
              }
              await host.updateSelf();
            }}
          ></input>
        );
      }
      return col.title ?? col.field;
    },

    dataCellFormatter(col, row, index, rows, host) {
      const value = row[col.field];
      switch (col.type) {
        case "index":
          return index + 1;
        case "checkbox":
          if (!col.checked) {
            col.checked = [];
          }
          return (
            <input
              type="checkbox"
              checked={col.checked?.includes(value)}
              onChange={async (evt) => {
                const index = col.checked.indexOf(value);
                if (index == -1) {
                  col.checked.push(value);
                } else {
                  col.checked.splice(index, 1);
                }
                await host.updateSelf();
              }}
            ></input>
          );
        case "radio":
          return <input type="radio"></input>;
        default:
          return value;
      }
    },
    height: "auto",
  };
  static propTypes = {
    showHeader: Boolean,
  };

  render() {
    const {
      columns,
      rows,
      showHeader,
      titleCellFormatter,
      dataCellFormatter,
      height,
    } = this.$props;
    const outerClass = extractClass(this.$props)?.class ?? "";
    return (
      <div className="table-container" style={{ height }}>
        <table className={`table ${outerClass}`}>
          <thead>
            {showHeader && (
              <tr>
                {columns?.map((col) => (
                  <th style={col.titleStyle} scope="col">
                    {titleCellFormatter(col, columns, rows, this)}
                  </th>
                ))}
              </tr>
            )}
            <slot name="header"></slot>
          </thead>
          <tbody>
            {rows?.map((row, index) => (
              <tr>
                {columns.map((col) => (
                  <td style={col.style}>
                    {dataCellFormatter(col, row, index, rows, this)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <slot name="footer"></slot>
          </tfoot>
        </table>
      </div>
    );
  }
}
