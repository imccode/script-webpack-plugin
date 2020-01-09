import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs'
import path from 'path'
import { Compiler } from 'webpack'
import { BabelConfiguration, ScriptWebpackPluginOptions, SmartCosmiconfigResult } from './types'

/**
 * 生成babel配置
 */
export default (options: ScriptWebpackPluginOptions, compiler: Compiler) => {
  const babelConfig: BabelConfiguration = {
    /**
     * 转换器
     */
    presets: [
      /**
       * 转换需要的浏览器环境代码
       */
      ['@babel/preset-env', { modules: false, useBuiltIns: 'usage', corejs: 3 }]
    ],
    /**
     * 插件
     */
    plugins: [
      /**
       * 顺序不可以调整
       */
      'babel-plugin-lodash',
      /**
       * 展开运算符
       */
      '@babel/plugin-proposal-object-rest-spread',
      /**
       * 装饰器
       *
       * @connet()
       */
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      /**
       * class 类
       */
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      /**
       * export v from 'mod'
       */
      '@babel/plugin-proposal-export-default-from',
      /**
       * export * as ns from 'mod'
       */
      '@babel/plugin-proposal-export-namespace-from',
      /**
       * require('mod')
       */
      '@babel/plugin-transform-modules-commonjs',
      /**
       * import('mod')
       */
      '@babel/plugin-syntax-dynamic-import',
      /**
       * 去除重复的 polyfill 导入
       */
      ['@babel/plugin-transform-runtime', { corejs: 3 }]
    ]
  }

  /**
   * 用户的babel配置
   */
  const userBabelConfig: SmartCosmiconfigResult<BabelConfiguration> = cosmiconfigSync(
    'babel'
  ).search()

  /**
   * 是否使用typescript语言
   */
  const isTypescript: boolean = fs.existsSync(path.resolve(compiler.context, 'tsconfig.json'))

  const returnKey = (data: string | Array<string | { [key: string]: any }>): string => {
    if (typeof data === 'string') {
      return data
    }

    if (Array.isArray(data) && data.length > 0) {
      const name = data[0]
      if (typeof name === 'string') {
        return name
      }
    }

    return ''
  }

  if (userBabelConfig) {
    const { presets, plugins }: BabelConfiguration = userBabelConfig.config

    if (presets && Array.isArray(presets)) {
      babelConfig.presets.forEach((item, index) => {
        const key = returnKey(item)
        presets.forEach((userPareset, userIndex) => {
          const useKey = returnKey(userPareset)
          if (useKey !== '' && key === useKey) {
            babelConfig.presets[index] = userPareset
            delete presets[userIndex]
          }
        })
      })
      babelConfig.presets = [...babelConfig.presets, ...presets.filter(item => !!item)]
    }
    if (plugins && Array.isArray(plugins)) {
      babelConfig.plugins.forEach((item, index) => {
        const key = returnKey(item)
        plugins.forEach((userPlugin, userIndex) => {
          const useKey = returnKey(userPlugin)
          if (useKey !== '' && key === useKey) {
            babelConfig.plugins[index] = userPlugin
            delete plugins[userIndex]
          }
        })
      })

      babelConfig.plugins = [
        ...babelConfig.plugins.slice(0, babelConfig.plugins.length - 1 || 0),
        ...plugins.filter(item => !!item),
        ...babelConfig.plugins.slice(babelConfig.plugins.length - 1)
      ]
    }
  }

  /**
   * 转换ts、tsx语法
   */
  if (isTypescript) {
    babelConfig.presets.push('@babel/preset-typescript')
    compiler.options.resolve.extensions = [...compiler.options.resolve.extensions, '.ts']
  }

  return babelConfig
}
