import { ScriptWebpackPluginOptions, BabelConfigType } from './types'
import { Compiler } from 'webpack'
import path from 'path'

export default (options: ScriptWebpackPluginOptions = {}, compiler: Compiler) => {
  // 默认配置
  const defaultOptions: ScriptWebpackPluginOptions = {
    dropConsole: true,
    cacheDirectory: compiler.options.mode === 'production' ? false : path.resolve(compiler.context, 'node_modules/.cache', 'script'),
    babelConfigType: BabelConfigType.add
  }

  const mergeOptions: ScriptWebpackPluginOptions = {
    ...defaultOptions,
    ...options,
    framework: options.framework || {}
  }

  if (options.cacheDirectory && typeof options.cacheDirectory === 'string') {
    mergeOptions.cacheDirectory = options.cacheDirectory
  }

  return mergeOptions
}
