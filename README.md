# script-webpack-plugin

:kissing_heart:一个处理脚本文件的webpack插件。

特性：运行环境按需补丁、自动分包、代码压缩、多线程打包、生成gizp、支持ESNext、typescript语法、开发环境缓存构建。

:point_right:
[![github](https://img.shields.io/github/release-date/imccode/script-webpack-plugin.svg)](https://github.com/imccode/script-webpack-plugin/releases)
[![npm-version](https://img.shields.io/npm/v/script-webpack-plugin.svg)](https://www.npmjs.com/package/script-webpack-plugin)
[![webpack](https://img.shields.io/badge/webpack-%3E%20%3D%204.0.0-blue.svg)](https://webpack.js.org/)
[![nodejs](https://img.shields.io/badge/node-%3E%20%3D%2010.0.0-blue.svg)](https://nodejs.org/)
[![license](https://img.shields.io/npm/l/script-webpack-plugin.svg)](https://www.npmjs.com/package/script-webpack-plugin)
[![pull request](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/imccode/script-webpack-plugin/pulls)

## 安装获取

```shell
yarn add script-webpack-plugin -D

npm install script-webpack-plugin -D

pnpm install script-webpack-plugin -D
```

## 使用方式

```javascript
const ScriptWebpackPlugin = require('script-webpack-plugin')

module.exports = {
  plugins: [new ScriptWebpackPlugin()]
}
```

```javascript
const ScriptWebpackPlugin = require('script-webpack-plugin')

module.exports = {
  plugins: [
    new ScriptWebpackPlugin({
      dropConsole: false
    })
  ]
}
```

## 注意

项目默认使用`babel7`进行脚本转码，见[源码](./src/babelConfig.ts)

默认使用的转换器：

- `@babel/preset-env` 转换需要的浏览器环境代码
- `@babel/preset-typescript` 根据是否存在tsconfig.json文件判断，是否装置该插件

默认使用的插件：

- `@babel/plugin-proposal-nullish-coalescing-operator` typescript的可选链(`var.prd ?? 'test'`)
- `@babel/plugin-proposal-decorators` 装饰器(`@connet()`)
- `@babel/plugin-proposal-class-properties` class 类
- `@babel/plugin-proposal-export-default-from` 默认导出(`export v from 'mod'`)
- `@babel/plugin-proposal-export-namespace-from` 模糊导出(`export * as ns from 'mod'`)
- `@babel/plugin-transform-runtime` 去除重复的 polyfill 导入

## 配置项

具体配置项的数据类型见[types.ts](./src/types.ts)

- `cacheDirectory` 生成缓存目录。 生成环境默认不开启，开发环境默认: `'./node_modules/.cache/script'`
- `dropConsole` 是否在生产环境删除console。 默认: `true`
- `gzip` 脚本文件的gizp压缩。默认开启，详见：<https://github.com/webpack-contrib/compression-webpack-plugin>

按照[babelConfig](https://babeljs.io/docs/en/config-files)配置要求，例如创建`babel.config.js`文件，最终会和默认配置合并。

按照[browserslist](https://github.com/browserslist/browserslist#queries)配置要求，例如创建`.browserslistrc`，最终采用browserslist的配置要求生成代码。
