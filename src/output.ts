import { Compiler, Output } from 'webpack'
import { ScriptWebpackPluginOptions } from './types'

/**
 * 修改导出路径配置
 */
export default (options: ScriptWebpackPluginOptions = {}, compiler: Compiler) => {
  const output: Output = {
    /**
     * 导出文件名设置
     *
     * 根据文件chunk内容生成名字
     */
    filename:
      compiler.options.mode === 'production'
        ? 'js/[name].[contenthash:8].min.js'
        : 'js/[name].[hash:8].js',
    /**
     * 导出分块(chunk)文件名设置
     *
     * 根据文件chunk内容生成名字
     */
    chunkFilename:
      compiler.options.mode === 'production'
        ? 'js/[name].chunk-[contenthash:8].min.js'
        : 'js/[name].chunk-[hash:8].js'
  }

  compiler.options.output.filename = output.filename
  compiler.options.output.chunkFilename = output.chunkFilename
}
