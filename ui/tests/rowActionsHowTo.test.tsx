/**
 * The how-to paragraph above the fleet is one translated sentence with the four
 * styled action names set into it (Kiro Crew #33327), so every language orders it
 * its own way. `i18nNodes` puts each `<name/>` tag's element where the catalog
 * string places it, as the dashboard's `<Trans components>` does.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'

import { CATALOGS } from '../src/i18n'
import { i18nNodes } from '../src/i18nNodes'
import { stubLocale } from './stubs/app-sdk'

const HOW = 'pages.devFleetPage.row_actions_how_to'
const TAGS = ['<pull/>', '<pod/>', '<rebase/>', '<prune/>']

function catalogText(locale: string): string {
  const pages = CATALOGS[locale].pages as Record<string, Record<string, string>>
  return pages.devFleetPage.row_actions_how_to
}

function renderHow(): HTMLElement {
  const { container } = render(
    <p>
      {i18nNodes(HOW, {
        pull: <b>PULL</b>,
        pod: <b>POD</b>,
        rebase: <b>REBASE</b>,
        prune: <b>PRUNE</b>,
      })}
    </p>,
  )
  return container.querySelector('p') as HTMLElement
}

afterEach(() => stubLocale('en'))

describe('row actions how-to sentence', () => {
  it('carries every styled part exactly once in every bundled language', () => {
    for (const locale of Object.keys(CATALOGS)) {
      const text = catalogText(locale)
      for (const tag of TAGS) expect(text.split(tag), `${locale} ${tag}`).toHaveLength(2)
    }
  })

  it('renders the English sentence with the names in place and no tag left', () => {
    const p = renderHow()
    expect(p.textContent).toBe(
      'Each row below is a git worktree discovered from the main checkout. Use PULL on the main row to fast-forward it from origin and rebuild (then restart the gateway to apply). POD boots any worktree as an isolated throwaway gateway so you can QA a feature branch without touching your live instance. REBASE moves a feature branch onto the latest main, and PRUNE safely removes worktrees whose PR has already merged.',
    )
    expect(Array.from(p.querySelectorAll('b')).map((b) => b.textContent)).toEqual(['PULL', 'POD', 'REBASE', 'PRUNE'])
  })

  it('follows the catalog word order in Japanese', () => {
    stubLocale('ja')
    const p = renderHow()
    const expected = catalogText('ja')
      .split('<pull/>').join('PULL')
      .split('<pod/>').join('POD')
      .split('<rebase/>').join('REBASE')
      .split('<prune/>').join('PRUNE')
    expect(p.textContent).toBe(expected)
    expect(p.textContent).not.toContain('<')
  })

  it('keeps a tag with no element as written', () => {
    const p = render(<p>{i18nNodes(HOW, { pull: <b>PULL</b> })}</p>).container.querySelector('p') as HTMLElement
    expect(p.textContent).toContain('PULL')
    expect(p.textContent).toContain('<pod/>')
    expect(p.querySelectorAll('b')).toHaveLength(1)
  })
})
