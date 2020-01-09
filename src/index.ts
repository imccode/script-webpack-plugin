import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import path from 'path'
import { Compiler } from 'webpack'
import mergeOptions from './mergeOptions'
import optimization from './optimization'
import output from './output'
import rules from './rules'
import { ScriptWebpackPluginOptions } from './types'
import vue from './vue'

/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
  options: ScriptWebpackPluginOptions = {}

  constructor(options: ScriptWebpackPluginOptions = {}) {
    this.options = options
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    const { resolve, plugins } = compiler.options
    this.options = mergeOptions(this.options, compiler)

    resolve.extensions.push('.js')
    resolve.alias = {
      '@': path.resolve(compiler.context, 'src'),
      ...(resolve.alias || {})
    }

    plugins.push(
      /**
       * 强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配
       */
      new CaseSensitivePathsPlugin()
    )

    vue(this.options, compiler)
    output(this.options, compiler)
    optimization(this.options, compiler)

    compiler.hooks.afterEnvironment.tap('ScriptWebpackPlugin', () => {
      compiler.options.module.rules.push(...rules(this.options, compiler))
    })
  }
}

export * from './types'
export { ScriptWebpackPlugin }
export default ScriptWebpackPlugin
module.exports = ScriptWebpackPlugin
