import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { Compiler } from 'webpack'
import hot from './hot'
import mergeOptions from './mergeOptions'
import optimization from './optimization'
import output from './output'
import rules from './rules'
import { ScriptWebpackPluginOptions } from './types'

/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
  options: ScriptWebpackPluginOptions = {}

  constructor(options: ScriptWebpackPluginOptions = {}) {
    this.options = options
  }

  /**
   * 注入vue的loader配置
   * @param compiler
   */
  injectVue(compiler: Compiler) {
    compiler.options.module.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        hotReload: this.options.hot
      }
    })
    compiler.options.resolve.extensions.push('.vue')
    compiler.options.plugins.push(new VueLoaderPlugin())
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.options = mergeOptions(this.options, compiler)

    compiler.options.plugins.push(
      /**
       * 强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配
       */
      new CaseSensitivePathsPlugin()
    )

    output(this.options, compiler)
    optimization(this.options, compiler)
    if (this.options.framework.vue) this.injectVue(compiler)
    if (this.options.hot) hot(this.options, compiler)

    compiler.hooks.afterEnvironment.tap('ScriptWebpackPlugin', () => {
      compiler.options.module.rules.push(...rules(this.options, compiler))
    })
  }
}

export * from './types'
export { ScriptWebpackPlugin }
export default ScriptWebpackPlugin
module.exports = ScriptWebpackPlugin
