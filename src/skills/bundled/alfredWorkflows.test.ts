import { afterEach, expect, test } from 'bun:test'

import { clearBundledSkills, getBundledSkills } from '../bundledSkills.js'
import { registerAlfredWorkflowSkills } from './alfredWorkflows.js'

afterEach(() => {
  clearBundledSkills()
})

test('alfred workflow bundle registers curated ECC-inspired skills', async () => {
  registerAlfredWorkflowSkills()

  const skills = getBundledSkills()
  const names = skills.map(skill => skill.name)

  expect(names).toContain('alfred-plan')
  expect(names).toContain('alfred-search')
  expect(names).toContain('alfred-tdd')
  expect(names).toContain('alfred-review')
  expect(names).toContain('alfred-verify')
  expect(names).toContain('alfred-security')

  const planSkill = skills.find(skill => skill.name === 'alfred-plan')
  expect(planSkill).toBeDefined()
  const blocks = await planSkill!.getPromptForCommand('add oauth onboarding', {} as never)
  expect(blocks[0]).toMatchObject({ type: 'text' })
  expect((blocks[0] as { text: string }).text).toContain('add oauth onboarding')
  expect((blocks[0] as { text: string }).text).toContain('Everything Claude Code')
})
