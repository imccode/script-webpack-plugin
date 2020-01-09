import { Compiler } from 'webpack';
import { ScriptWebpackPluginOptions } from './types';
/**
 * 脚本webpack插件
 */
declare class ScriptWebpackPlugin {
    options: ScriptWebpackPluginOptions;
    constructor(options?: ScriptWebpackPluginOptions);
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export * from './types';
export { ScriptWebpackPlugin };
export default ScriptWebpackPlugin;
