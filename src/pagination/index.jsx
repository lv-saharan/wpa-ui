import { h, classNames, createRef, extractClass } from "uiBase";
import Pager from "../pager";
import css from "./index.scss";
import { getCSSStyleSheets } from "../css";

/**
 * @module Pagination
 * @desc bootstrap风格分页组件，继承自Pager组件
 * @example
<wp-pagination
      total="1000"
      createInfo={(props, pager) => {
        let { pageNum } = props;
        let { pageCount } = pager;
        return (
          <div class="info">
            <span class="curr">當前{pageNum}</span>/
            <span class="total">總共{pageCount}</span>
          </div>
        );
      }}
    />
    <wp-pagination
      css={`
        :host {
          --wp-pager-page-bgcolor: #eee;
        }
      `}
      page-count="100"
      prev-text="上一頁"
      next-text="下一頁"
    />


*/

/**
 * @typedef {Object} Props
 * @property {string} aligin 对齐方式 默认:left
 * @property {number} pageNum 页码 默认：1
 * @property {number} [pageCount] 页数 默认：10
 * @property {number} [pageSize] 分页大小 默认：10
 * @property {number } [linksCount] 每页链接数 默认：10
 * @property {number } [total] 条数
 * @property {jsx } [prev] 上一页
 * @property {jsx } [next] 下一页
 * @property {jsx } [first] 第一页
 * @property {jsx } [last] 最后一页
 * @property {function} [createPrev] 创建上一页
 * @property {function} [createNext] 创建下一页
 * @property {function} [createFirst] 创建第一页
 * @property {function} [createLast] 创建最后一页
 * @property {function} [createPages] 创建分页
 * @property {function} [createInfo] 创建分页信息
 * @property {function} [createJumper] 创建跳转
 */
/**
 * @hideconstructor
 * @extends module:Pager
 */
export default class extends Pager {
  static css = [
    () => getCSSStyleSheets("reboot", "pagination", "utilities"),
    css,
  ];
  static defaultProps = {
    ...super.defaultProps,
    align: "left",
    createPrev(settings, pager) {
      let { pageNum, prev } = settings;
      return (
        <li class={classNames("page-item", { disabled: pageNum <= 1 })}>
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            onClick={(evt) => {
              if (pageNum > 1) pager.goto(pageNum - 1);
              evt.preventDefault();
              evt.stopPropagation();
            }}
          >
            <span aria-hidden="true">&lsaquo;</span>
          </a>
        </li>
      );
    },

    createNext(settings, pager) {
      let { pageNum, next } = settings;
      let { pageCount } = pager;
      return (
        <li class={classNames("page-item", { disabled: pageNum >= pageCount })}>
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            onClick={(evt) => {
              if (pageCount > pageNum) pager.goto(pageNum + 1);
              evt.preventDefault();
              evt.stopPropagation();
            }}
          >
            <span aria-hidden="true">&rsaquo;</span>
          </a>
        </li>
      );
    },
    createFirst(settings, pager) {
      let { first, pageNum } = settings;
      return (
        <li class={classNames("page-item", { disabled: pageNum <= 1 })}>
          <a
            class="page-link"
            href="#"
            aria-label="First"
            onClick={(evt) => {
              if (pageNum != 1) pager.goto(1);
              evt.preventDefault();
              evt.stopPropagation();
            }}
          >
            <span aria-hidden="true"> &laquo;</span>
          </a>
        </li>
      );
    },
    createLast(settings, pager) {
      let { last, pageNum } = settings;
      let { pageCount } = pager;
      return (
        <li class={classNames("page-item", { disabled: pageNum >= pageCount })}>
          <a
            class="page-link"
            href="#"
            aria-label="Last"
            onClick={(evt) => {
              if (pageNum != pageCount) pager.goto(pageCount);
              evt.preventDefault();
              evt.stopPropagation();
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      );
    },

    createPages(settings, pager) {
      let { linksCount, pageNum } = settings;
      let { pageCount } = pager;
      let half = Math.ceil(linksCount / 2);
      let left = pageNum > half ? pageNum - half : 1;
      let right = left + linksCount - 1;
      if (right > pageCount) right = pageCount;
      left = right - linksCount + 1;
      let $links = [];
      if (left < 1) left = 1;
      for (let i = left; i <= right; i++) {
        $links.push(
          <li
            key={`pager-${i}`}
            className={classNames("page-item", {
              active: pageNum == i,
              page: true,
            })}
          >
            <a
              class="page-link"
              href="#"
              onClick={(evt) => {
                if (pageNum != i) pager.goto(i);
                evt.preventDefault();
                evt.stopPropagation();
              }}
            >
              {i}
            </a>
          </li>
        );
      }
      return $links;
    },

    createInfo(settings, pager) {
      let { pageNum } = settings;
      let { pageCount } = pager;

      return (
        <li class="info page-item">
          <span className="page-link">
            <span class="curr">{pageNum}</span>/
            <span class="total">{pageCount}</span>
          </span>
        </li>
      );
    },
    createJumper(settings, pager) {
      return (
        <li class="jumper page-item mx-2">
          <span className="page-link">
            前往
            <input
              class="jump-to"
              title={`请输入1-${pager.pageCount}的数字`}
              type="number"
              min="1"
              max={pager.pageCount}
              onChange={(evt) => {
                let $jumpTo = evt.currentTarget;
                let num = Number($jumpTo.value);
                if (num > pager.pageCount) $jumpTo.value = pager.pageCount;
                if (num < 1) $jumpTo.value = 1;
                num = Number($jumpTo.value);
                pager.goto(num);
              }}
            />
            页
          </span>
        </li>
      );
    },
    createLayout(settings, pager) {
      let {
        createFirst,
        createPrev,
        createPages,
        createNext,
        createLast,
        createJumper,
        createInfo,
      } = settings;
      return (
        <nav>
          <ul
            {...extractClass(settings, "pagination", {
              "justify-content-end": settings.align == "right",
              "justify-content-center": settings.align == "center",
            })}
          >
            {createFirst(settings, pager)}
            {createPrev(settings, pager)}
            {createPages(settings, pager)}
            {createNext(settings, pager)}
            {createLast(settings, pager)}
            {createJumper(settings, pager)}
            {createInfo(settings, pager)}
          </ul>
        </nav>
      );
    },
  };

  static propTypes = { ...super.propTypes, align: String };
}
