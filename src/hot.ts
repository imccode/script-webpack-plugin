import path from 'path'
import { Compiler } from 'webpack'
import { ScriptWebpackPluginOptions } from './types'
import { includesEntry } from './utils'

const pluginName = 'ScriptWebpackPlugin'

export default (options: ScriptWebpackPluginOptions,compiler: Compiler) => {
  compiler.hooks.normalModuleFactory.tap(pluginName, normalModuleFactory => {
    normalModuleFactory.hooks.afterResolve.tap(pluginName, data => {
      if (
        !/node_modules/.test(data.resource) &&
        !data.rawRequest.includes('hot/client?wsPort') &&
        includesEntry(compiler.options.entry, data.rawRequest)
      ) {
        data.loaders.unshift({
          loader: path.resolve(__dirname, './reactRefreshLoader')
        })
      }
      return data
    })
  })
}
