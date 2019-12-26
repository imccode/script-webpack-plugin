import { Entry, EntryFunc } from "webpack";
/**
 * entry是否包含 条件module
 */
declare const includesEntry: (entry: string | string[] | Entry | EntryFunc, module: string) => any;
export { includesEntry };
