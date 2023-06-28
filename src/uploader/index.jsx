const { h, classNames } = wpa;
import uiBase from "../uiBase";
import css from "./index.scss";
import { getCSSStyleSheets } from "../css";
import pictures from "./templates/pictures";
import files from "./templates/files";
import { getExtension, getName } from "../utils";
import { creatPreviewUrl } from "preview-utils";

const Templates = { pictures, files, none: null };
const STATUS = {
  NONE: "NONE",
  UPLOADING: "UPLOADING",
  UPLOADED: "UPLOADED",
  ERROR: "ERROR",
};

/**
 * @module Uploader
 * @desc 上传组件
 * @example
<wp-uploader files={files} multiple></wp-uploader> 
*/

/**
 * @typedef {Object} Resource
 * @property {string}  id
 * @property {string}  name
 * @property {string}  ext
 * @property {number}  size
 * @property {string}  type
 * @property {Date}  lastModified
 * @property {File}  file
 *
 */

/**
 * @typedef {Object} Props
 * @property {string} accept 文件类别
 * @property {string} action 上传地址
 * @property {Object|function} [headers] 附加头信息
 * @property {boolean} [multiple] 多选 默认：false
 * @property {boolean} [autoUpload] 自动上传 默认：false
 * @property {boolean} [allowSort] 允许排序 默认：false
 * @property {number|boolean} [limit] 允许数量  默认：false
 * @property {boolean} [withCredentials] 允许cookie
 * @property { Array.<Resource>} files 文件列表
 */

export default class extends uiBase {
  static creatPreviewUrl = creatPreviewUrl;
  static get STATUS() {
    return STATUS;
  }
  static css = [
    () =>
      getCSSStyleSheets(
        "reboot",
        "containers",
        "grid",
        "card",
        "utilities",
        "buttons",
        "tables"
      ),
    css,
  ];
  static defaultProps = {
    accept: "",
    action: "",
    selectText: "选择文件上传",
    headers: null, //对象或返回对象的方法
    multiple: false,
    autoUpload: false,
    allowSort: false, //多选，并允许排序时才会有排序功能
    limit: false,
    withCredentials: false,
    template: "pictures", // file,picture-form,file-form,
    files: [], //{id,name,size,file,url,ext,type,status}
    uploadHandler(
      resource,
      url,
      { paramName = "file", withCredentials = false, headers }
    ) {
      const file = resource.file;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append(paramName, file);
      xhr.withCredentials = withCredentials;
      xhr.open("POST", url);

      if (typeof headers === "function") {
        headers = headers();
      }
      if (typeof headers === "object") {
        for (let key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      resource.status = STATUS.UPLOADING;
      xhr.onreadystatechange = (args) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("上传成功");
          let data = xhr.responseText;
          try {
            data = JSON.parse(data);
          } catch (exc) {
            resource.status = STATUS.ERROR;
            console.error(exc);
          }
          resource.status = STATUS.UPLOADED;
          // Object.assign(file, data);
          /**
           * @event module:Uploader#progress 上传完成
           * @prop {Object} data 上传信息 { resource, data }
           * @example
           *
           * <wp-uploader onUploaded={evt=>{
           *    let {resource, data  }=evt.detail
           *    //do something
           * }} />
           */
          this.fire("uploaded", { resource, data, uploader: this });
          this.refresh();
        }
        if (xhr.status > 400) {
          file.status = STATUS.ERROR;
          console.log("上传失败", xhr, args);
        }

        // else {
        //   file.status = STATUS.ERROR;
        //   console.log("上传失败", xhr, args);
        // }
      };
      //监听文件上传（xhr.upload）进度
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          let percentage = Math.ceil((e.loaded / e.total) * 100);
          resource.progress = percentage;
          /**
           * @event module:Uploader#progress 上传进度
           * @prop {Object} data 进度信息 { resource, loaded }
           * @example
           *
           * <wp-uploader onProgress={evt=>{
           *    let {resource, loaded }=evt.detail
           *    //do something
           * }} />
           */
          this.fire("progress", { resource, loaded: e.loaded, uploader: this });
          console.log(percentage + "%");
          this.refresh();
        }
      };
      xhr.send(fd);
    },
  };
  static propTypes = {
    accept: String,
    action: String,
    selectText: String,
    multiple: Boolean,
    autoUpload: Boolean,
    allowSort: Boolean,
    limit: Number,
    withCredentials: Boolean,
  };
  #replaceIndex = -1;

  /**
   * 选择文件
   * @param {number} index 插入的位置
   */
  open(index = -1) {
    this.#replaceIndex = index;
    this.$("#files").click();
    /**
     * @event module:Uploader#open 选择文件
     * @prop {Object} data 文件插入点 { index }
     * @example
     *
     * <wp-uploader onOpen={evt=>{
     *    let {index }=evt.detail
     *    //do something
     * }} />
     */
    this.fire("open", { index });
  }
  /**
   * 删除文件
   * @param {number} index
   */
  remove(index) {
    this.$props.files?.splice(index, 1);
    this.updateSelf();
    /**
     * @event module:Uploader#remove 删除文件
     * @prop {Object} data 删除信息 { index }
     * @example
     *
     * <wp-uploader onRemove={evt=>{
     *    let {index}=evt.detail
     *    //do something
     * }} />
     */
    this.fire("remove", { index });
  }

  select(files) {
    let { multiple, files: all, autoUpload } = this.$props;
    if (files?.length == 0) return false;
    if (!multiple) all.splice(0, all.length);
    if (this.#replaceIndex != -1 && files.length >= 1) {
      let replaceFiles = Array.from(files).map((file) => {
        return {
          id: null,
          name: getName(file.name),
          ext: getExtension(file.name),
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          file,
        };
      });
      all.splice(this.#replaceIndex, 1, ...replaceFiles);
      /**
       * @event module:Uploader#replaced 替换文件
       * @prop {Object} data 替换信息 { index, replaceFiles }
       * @example
       *
       * <wp-uploader onReplaced={evt=>{
       *    let {index,replaceFiles}=evt.detail
       *    //do something
       * }} />
       */
      this.fire("replaced", { index: this.#replaceIndex, replaceFiles });
    } else {
      let selected = Array.from(files).map((file) => {
        return {
          id: null,
          name: getName(file.name),
          ext: getExtension(file.name),
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          file,
          status: STATUS.NONE,
        };
      });
      all.push(...selected);
      /**
       * @event module:Uploader#selected 选择了文件
       * @prop {Array.<Resource>} resources 选择的资源
       * @example
       *
       * <wp-uploader onSelected={evt=>{
       *    let resources=evt.detail.selected
       *    //do something
       * }} />
       */
      this.fire("selected", { selected });
    }
    this.updateSelf();
    if (autoUpload === true) this.upload();
  }
  refresh() {
    this.forceUpdate();
  }
  get uploadHandler() {
    return this.$props.uploadHandler;
  }
  upload() {
    let { files, action, withCredentials, headers } = this.$props;
    if (!action) alert("没有设置上传地址");
    let index = 0;

    for (let file of files.filter(
      (f) => f.file && (!f.status || f.status == STATUS.NONE)
    )) {
      file.index = index++;
      this.uploadHandler.call(this, file, action, { withCredentials, headers });
    }
  }
  render() {
    let { multiple, accept, template } = this.$props;

    return (
      <>
        <slot>{Templates[template]}</slot>
        <input
          id="files"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(evt) => {
            this.select(evt.target.files);
            evt.target.value = null;
          }}
        />
      </>
    );
  }
}
