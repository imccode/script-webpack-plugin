import path from 'path'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { Compiler } from 'webpack'
import { ScriptWebpackPluginOptions } from './types'

/**
 * vue框架相关的特殊配置
 */
export default (options: ScriptWebpackPluginOptions = {}, compiler: Compiler) => {
  const { dependencies = {}, devDependencies = {} } = require(path.resolve(
    compiler.context,
    'package.json'
  ))

  if (!dependencies.vue && !devDependencies.vue) return

  const { module, plugins, resolve } = compiler.options

  resolve.extensions.push('.vue')

  module.rules.push({
    test: /\.vue$/,
    loader: 'vue-loader'
  })

  plugins.push(new VueLoaderPlugin())
}
