import { Entry, EntryFunc } from "webpack"

/**
 * entry是否包含 条件module
 */
const includesEntry = (entry: string | string[] | Entry | EntryFunc, module: string) => {
  if (typeof entry === 'string' || Array.isArray(entry)) {
    return entry.includes(module)
  } else if (typeof entry === 'function') {
    // @ts-ignore
    return includesEntry(entry(), module)
  }

  for (let i = 0, len = Object.keys(entry).length; i < len; i++) {
    if (includesEntry(entry[i], module)) return true
  }
  return false
}

export { includesEntry }

