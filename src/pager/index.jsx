const { h, classNames } = wpa
import uiBase from "../uiBase";
import css from "./index.scss";


/**
 * @module Pager
 * @desc 分页组件
 * @example
<wp-pager
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
    <wp-pager
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

 
export default class extends uiBase {
  static css = css;
  static propTypes = {
    pageNum: Number,
    pageCount: Number,
    pageSize: Number,
    total: Number,
    showMore: Boolean,
  };
  static defaultProps = {
    pageNum: 1,
    pageCount: 10,
    pageSize: 10, //每頁條數，和total配合
    linksCount: 10,
    showMore: true,
    prev: <wp-icon name="keyboard_arrow_left" />,
    next: <wp-icon name="keyboard_arrow_right" />,
    first: <wp-icon name="first_page" />,
    last: <wp-icon name="last_page" />,
    createPrev(settings, pager) {
      let { pageNum, prev } = settings;
      return (
        <div
          class={classNames("prev", { disable: pageNum <= 1 })}
          onClick={(evt) => {
            if (pageNum > 1) pager.goto(pageNum - 1);
          }}
        >
          {prev}
        </div>
      );
    },

    createNext(settings, pager) {
      let { pageNum, next } = settings;
      let { pageCount } = pager;
      return (
        <div
          class={classNames("next", { disable: pageNum >= pageCount })}
          onClick={(evt) => {
            if (pageCount > pageNum) pager.goto(pageNum + 1);
          }}
        >
          {next}
        </div>
      );
    },
    createFirst(settings, pager) {
      let { first, pageNum } = settings;

      return (
        <div
          class={classNames("first", { disable: pageNum <= 1 })}
          onClick={(evt) => {
            if (pageNum != 1) pager.goto(1);
          }}
        >
          {first}
        </div>
      );
    },
    createLast(settings, pager) {
      let { last, pageNum } = settings;
      let { pageCount } = pager;
      return (
        <div
          class={classNames("last", { disable: pageNum >= pageCount })}
          onClick={(evt) => {
            if (pageNum != pageCount) pager.goto(pageCount);
          }}
        >
          {last}
        </div>
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
          <div
            className={classNames({ active: pageNum == i, page: true })}
            onClick={(evt) => {
              if (pageNum != i) pager.goto(i);
            }}
          >
            {i}
          </div>
        );
      }
      return $links;
    },

    createInfo(settings, pager) {
      let { pageNum } = settings;
      let { pageCount } = pager;

      return (
        <div class="info">
          <span class="curr">{pageNum}</span>/
          <span class="total">{pageCount}</span>
        </div>
      );
    },
    createJumper(settings, pager) {
      return (
        <div class="jumper">
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
        </div>
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
        <div class="pager">
          {createFirst(settings, pager)}
          {createPrev(settings, pager)}
          {createPages(settings, pager)}
          {createNext(settings, pager)}
          {createLast(settings, pager)}
          {createJumper(settings, pager)}
          {createInfo(settings, pager)}
        </div>
      );
    },
  };

  /**
   * 当前页码
   */
  get currPageNum() {
    return this.$props.pageNum;
  }

  /**
   * 分页数
   */
  get pageCount() {
    let { total, pageSize, pageCount } = this.$props;
    if ((total || total === 0) && pageSize) {
      return Math.ceil(total / pageSize);
    }
    return pageCount;
  }

  /**
   * 跳转至分页
   * @param {number} pageNum 
   * @fires module:Pager#paged
   */
  goto(pageNum) {
    let { pageCount } = this.$props;

    if (pageNum >= 1 || pageNum < pageCount) {
      this.update$Props({
        pageNum,
      }).then(() => {
        /**
         * @event module:Pager#paged 分页切换
         * @prop {number} pageNum  当前页码
         * @example
         *
         * <wp-pager onPaged={evt=>{
         *    let pageNum=evt.detail
         *    //do something
         * }} />
         */
        this.fire("paged", pageNum);
      });
    }
  }

  render(settings) {
    return settings.createLayout(settings, this);
  }
}
