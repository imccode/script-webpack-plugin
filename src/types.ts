import CompressionPlugin = require('compression-webpack-plugin')

/**
 * script-webpack-plugin 脚本资源 插件的可配参数
 */
export interface ScriptWebpackPluginOptions {
  /**
   * 启用缓存，指定缓存路径
   *
   * 默认development环境启用
   */
  cacheDirectory?: string | boolean
  /**
   * 是否删除console
   *
   * 默认true
   */
  dropConsole?: boolean
  /**
   * 是否开启hot代码热更新
   */
  hot?: boolean
  /**
   * 框架支持情况
   */
  framework?: {
    /** 支持vue 框架编译 */
    vue?: boolean
    /** 支持react 框架编译 */
    react?: boolean
  }
  /**
   * 资源生成gzip
   * docs: https://github.com/webpack-contrib/compression-webpack-plugin
   */
  gzip?: false | CompressionPlugin.Options<any>
  /** babel配置的类型 */
  babelConfigType?: BabelConfigType
}

export enum BabelConfigType {
  /** 完全自定义的配置 */
  custom = 'custom',
  /** 追加的方式 */
  add = 'add'
}

export type ArrayOptions = Array<string | Array<string | { [key: string]: any }>>

/**
 * babel配置
 *
 * docs: https://babeljs.io/docs/en/config-files
 */
export interface BabelConfiguration {
  /**
   * 转换器
   */
  presets?: ArrayOptions
  /**
   * 插件
   */
  plugins?: ArrayOptions
  /**
   * 未来可能引入的配置
   */
  [key: string]: any
}

/**
 * CosmiconfigResult
 */
export type SmartCosmiconfigResult<T> = {
  /**
   * 配置
   */
  config: T
  /**
   * 配置文件路径
   */
  filepath: string
  /**
   * 配置是否为空
   */
  isEmpty?: boolean
} | null
