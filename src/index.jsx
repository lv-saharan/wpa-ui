/**
 * @file WPA UI  Source Files
 * @desc 采用bootstrap样式
 * @see {@link https://getbootstrap.com/docs/5.3/|bootstrap}
 * @author lv.saharan
 */

const { define } = wpa;
import utils from "./utils";
import sortable from "./sortable";

import tab from "./tab";
import icon from "./icon";
import bicon from "./bootstrap/icons";
import rate from "./rate";
import pager from "./pager";
import pagination from "./pagination";
import tree, { treeNode } from "./tree";
import loading from "./loading";
import css from "./css";
import effect from "./effect";
import alert from "./alert";
import accordion from "./accordion";
import breadcrumb from "./breadcrumb";
import modal from "./modal";
import popover from "./popover";
import uploader from "./uploader";
import carousel from "./carousel";
import badge from "./badge";
import toast from "./toast";
import progress from "./progress";
import tooltip from "./tooltip";
import layout from "./layout";
import _import from "./import";
import offcanvas from "./offcanvas";
import form from "./form";
import dropdown from "./dropdown";
import coder from "./coder";
import select from "./select";
import table from "./table";
import tinymce from "./tinymce";
import echarts from "./echarts";

define("wp-rate", rate);
define("wp-tab", tab);
define("wp-icon", icon);
define("wp-bi", bicon);
define("wp-pager", pager);
define("wp-tree", tree);
define("wp-loading", loading);
define("wp-alert", alert);
define("wp-accordion", accordion);
define("wp-breadcrumb", breadcrumb);
define("wp-modal", modal);
define("wp-popover", popover);
define("wp-uploader", uploader);
define("wp-carousel", carousel);
define("wp-badge", badge);
define("wp-toast", toast);
define("wp-progress", progress);
define("wp-tooltip", tooltip);
define("wp-layout", layout);
define("wp-import", _import);
define("wp-offcanvas", offcanvas);
define("wp-pagination", pagination);
define("wp-dropdown", dropdown);
define("wp-coder", coder);
define("wp-select", select);
define("wp-table", table);
define("wp-tinymce", tinymce);
define("wp-echarts", echarts);

// define("wp-form", form);
customElements.define("wp-form", form, { extends: "form" });

const importURL = import.meta.url;

wpa.ui = {
  version: "1.0.8",
  utils,
  css,
  effect,
  icon,
  tab,
  rate,
  pager,
  tree,
  treeNode,
  loading,
  alert,
  accordion,
  breadcrumb,
  modal,
  popover,
  uploader,
  carousel,
  badge,
  toast,
  progress,
  tooltip,
  layout,
  import: _import,
  offcanvas,
  pagination,
  form,
  dropdown,
  coder,
  select,
  table,
  importURL,
  sortable,
  tinymce,
  echarts,
};

export {
  utils,
  css,
  effect,
  icon,
  bicon,
  tab,
  rate,
  pager,
  tree,
  treeNode,
  loading,
  alert,
  accordion,
  breadcrumb,
  modal,
  popover,
  uploader,
  carousel,
  toast,
  progress,
  tooltip,
  layout,
  _import as import,
  offcanvas,
  pagination,
  form,
  dropdown,
  coder,
  select,
  table,
  importURL,
  sortable,
  tinymce,
  echarts,
};
