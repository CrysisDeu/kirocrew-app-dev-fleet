/**
 * A translated sentence with elements set into it, the way the dashboard's
 * `<Trans components>` renders one: each self-closing `<name/>` in the catalog
 * string is replaced by `components[name]`, so a translation can place a styled
 * word anywhere in its own word order. A tag with no component is kept as
 * written. Only the self-closing form is read; the catalogs use no other.
 */
import { Fragment, type ReactNode } from 'react'
import { i18nT } from './i18n'

export function i18nNodes(key: string, components: Readonly<Record<string, ReactNode>>): ReactNode[] {
  const text = i18nT(key)
  const out: ReactNode[] = []
  let rest = 0
  let at = text.indexOf('<')
  while (at !== -1) {
    const end = text.indexOf('/>', at)
    if (end === -1) break
    const name = text.slice(at + 1, end)
    if (Object.prototype.hasOwnProperty.call(components, name)) {
      if (at > rest) out.push(text.slice(rest, at))
      out.push(<Fragment key={`${name}-${out.length}`}>{components[name]}</Fragment>)
      rest = end + 2
      at = text.indexOf('<', rest)
    } else {
      at = text.indexOf('<', at + 1)
    }
  }
  if (rest < text.length) out.push(text.slice(rest))
  return out
}
