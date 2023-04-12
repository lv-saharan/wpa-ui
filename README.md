# wpa-ui
 样式采用bootstrap,整合bootstrap icons 和 material-design-icons

# 说明
内容整理中，
主要目的是构建使用标准esmodule模式项目开发环境

# esbuild
``` json
  "type": "module",
  "scripts": {
    "dev": "node esbuild.js dev",
    "build:all":"npm-run-all -s build:prod gen:icons build:icons build:loadings build:css build:coder",
    "build:prod": "node esbuild.js prod",
    "build:icons": "node ./src/icon/esbuild.js",
    "build:loadings": "node ./src/loading/esbuild.js",
    "build:css": "node ./src/bootstrap/esbuild.js",
    "build:coder": "node ./src/coder/esbuild.js",
    "gen:icons": "node ./src/icon/scripts/gen-icons.js"
  },
```
# Constrols
wp-rate

wp-tab

wp-icon

wp-bi  //bootstrap icons

wp-pager 

wp-tree 

wp-loading 

wp-alert 

wp-accordion 

wp-breadcrumb 

wp-modal 

wp-popover 

wp-uploader 

wp-carousel 

wp-badge 

wp-toast 

wp-progress

wp-tooltip 

wp-layout 

wp-import 

wp-offcanvas 

wp-pagination 

wp-dropdown 

wp-coder 

wp-select 

wp-table 

wp-tinymce

wp-echart 


# URL
[wpa UI ,一点示例](http://wpa.flatweb.net/demos/usage/ui/ "title")


[wpa playground,一些实践](http://wpa.flatweb.net "title")
