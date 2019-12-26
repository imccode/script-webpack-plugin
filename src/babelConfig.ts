import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs'
import path from 'path'
import { Compiler } from 'webpack'
import { BabelConfiguration, ScriptWebpackPluginOptions, SmartCosmiconfigResult } from './types'

export default (options: ScriptWebpackPluginOptions, compiler: Compiler) => {
  const babelConfig: BabelConfiguration = {
    /**
     * 转换器
     */
    presets: [
      /**
       * 转换需要的浏览器环境代码
       */
      '@babel/preset-env'
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
      '@babel/plugin-transform-runtime'
    ]
  }

  /**
   * 用户的babel配置
   */
  const userBabelConfig: SmartCosmiconfigResult<BabelConfiguration> = cosmiconfigSync(
    'babel'
  ).search()

  let config = babelConfig

  /**
   * 是否使用typescript语言
   */
  const isTypescript: boolean = fs.existsSync(path.resolve(compiler.context, 'tsconfig.json'))

  if (userBabelConfig) {
    config = userBabelConfig.config

    const { presets, plugins }: BabelConfiguration = userBabelConfig.config
    if (presets && Array.isArray(presets)) {
      config.presets = [...babelConfig.presets, ...presets]
    }
    if (plugins && Array.isArray(plugins)) {
      config.plugins = [
        ...babelConfig.plugins.slice(0, babelConfig.plugins.length - 1 || 0),
        ...plugins,
        ...babelConfig.plugins.slice(babelConfig.plugins.length - 1)
      ]
    }
  }

  /**
   * 转换ts、tsx语法
   */
  if (isTypescript) {
    config.presets.push('@babel/preset-typescript')
    compiler.options.resolve.extensions.push('.ts')
  }

  /**
   * 转换react jsx语法
   */
  if (options.framework.react) {
    config.presets.unshift(['@babel/preset-react', { useBuiltIns: 'usage' }])
    compiler.options.resolve.extensions.push('.jsx')
    isTypescript && compiler.options.resolve.extensions.push('.tsx')
  }

  return config
}
