import CompressionWebpackPlugin from 'compression-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { Compiler, Options } from 'webpack'
import { ScriptWebpackPluginOptions } from './types'

/** 模块优化 */
export default (options: ScriptWebpackPluginOptions, compiler: Compiler) => {
  if (compiler.options.mode !== 'production') return

  const optimization: Options.Optimization = {
    /**
     * 配置runtime文件
     */
    runtimeChunk: {
      /**
       * 多个chunk共享一个runtime入口，起名为runtime
       */
      name: 'runtime'
    },
    /**
     * 移除空chunk
     */
    removeEmptyChunks: true,
    /**
     * 通用分块策略
     */
    splitChunks: {
      /**
       * 表示将选择哪些块进行优化
       *
       * 优化异步模块
       */
      chunks: 'async',
      /**
       * 要生成的块的最小大小
       */
      minSize: 3e3,
      /**
       * 分割前必须共享模块的最小块数
       */
      minChunks: 1,
      /**
       * 按需加载时的最大并行请求数
       */
      maxAsyncRequests: 5,
      /**
       * 入口点处的最大并行请求数
       */
      maxInitialRequests: 3,
      /**
       * 多个块之间的连接符
       *
       * 如： module1-module2-module3.js
       */
      automaticNameDelimiter: '-',
      /**
       * 自动生成基于块和缓存组密钥的名称
       */
      name: true,
      /**
       * 构建缓存优化
       *
       * 不常修改文件在此配置
       */
      cacheGroups: {
        /**
         * vendor自定义块
         *
         * 打包自node_modules的模块
         */
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all',
          priority: 10
        }
      }
    },
    minimizer: [
      /**
       * 压缩优化js文件
       */
      new TerserWebpackPlugin({
        terserOptions: {
          /**
           * 导出配置
           */
          output: {
            /**
             * 删除注释
             */
            comments: false,
            /**
             * 自动格式化压缩
             */
            beautify: false
          },
          /**
           * 压缩配置 默认开启
           */
          compress: {
            /**
             * 删除 console
             */
            drop_console: options.dropConsole
          }
        },
        /**
         * 多线程压缩
         */
        parallel: true
      })
    ]
  }

  // 对js文件进行gzip
  if (options.gzip !== false) {
    optimization.minimizer.push(
      new CompressionWebpackPlugin({
        cache: options.cacheDirectory,
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$/,
        threshold: 1024,
        minRatio: 0.8,
        ...options.gzip
      })
    )
  }

  compiler.options.optimization = {
    ...compiler.options.optimization,
    ...optimization,
    splitChunks: {
      ...compiler.options.optimization.splitChunks,
      ...optimization.splitChunks
    }
  }
}
