import path from 'path'
import { Compiler } from 'webpack'
import { ScriptWebpackPluginOptions } from './types'

export default (options: ScriptWebpackPluginOptions = {}, compiler: Compiler) => {
  // 默认配置
  const defaultOptions: ScriptWebpackPluginOptions = {
    dropConsole: true,
    cacheDirectory: compiler.options.mode === 'production' ? false : path.resolve(compiler.context, 'node_modules/.cache', 'script')
  }

  const mergeOptions: ScriptWebpackPluginOptions = {
    ...defaultOptions,
    ...options
  }

  if (options.cacheDirectory && typeof options.cacheDirectory === 'string') {
    mergeOptions.cacheDirectory = options.cacheDirectory
  }

  return mergeOptions
}
