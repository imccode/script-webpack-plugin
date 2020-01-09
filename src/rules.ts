import { Compiler, RuleSetRule } from 'webpack'
import babelConfig from './babelConfig'
import { BabelConfigType, ScriptWebpackPluginOptions } from './types'

export default (options: ScriptWebpackPluginOptions, compiler: Compiler) => {
  const rules: RuleSetRule[] = [
    {
      test: /\.(j|t)sx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: require.resolve('thread-loader')
        },
        {
          loader: 'babel-loader',
          options: {
            /**
             * 将相对于解析程序选项中的所有路径的工作目录
             */
            cwd: compiler.context,
            /**
             * 启用缓存，指定缓存路径
             *
             * 默认development环境启用
             */
            cacheDirectory: options.cacheDirectory,
            /**
             * babel 配置
             */
            ...babelConfig(options, compiler)
          }
        }
      ]
    }
  ]

  return rules
}
