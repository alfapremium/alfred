import { describe, expect, test } from 'bun:test'

import {
  getAlfredOnboardingModelFromEnv,
  getAlfredOnboardingPresetFromEnv,
  resolveAlfredProviderChoice,
  shouldForceAlfredOnboarding,
} from './alfredOnboarding.js'

describe('resolveAlfredProviderChoice', () => {
  test('maps ChatGPT and Codex aliases to codex oauth', () => {
    expect(resolveAlfredProviderChoice('openai-codex')).toBe('codex-oauth')
    expect(resolveAlfredProviderChoice('chatgpt-oauth')).toBe('codex-oauth')
    expect(resolveAlfredProviderChoice('codex')).toBe('codex-oauth')
  })

  test('maps provider shortcuts', () => {
    expect(resolveAlfredProviderChoice('openrouter')).toBe('openrouter')
    expect(resolveAlfredProviderChoice('openai-compatible')).toBe('custom')
    expect(resolveAlfredProviderChoice('local')).toBe('ollama')
  })
})

describe('alfred onboarding env helpers', () => {
  test('reads preset and model from env', () => {
    expect(
      getAlfredOnboardingPresetFromEnv({
        OPENCLAUDE_ONBOARD_AUTH_CHOICE: 'openai-codex',
      }),
    ).toBe('codex-oauth')
    expect(
      getAlfredOnboardingModelFromEnv({
        OPENCLAUDE_ONBOARD_MODEL: 'openrouter/free',
      }),
    ).toBe('openrouter/free')
  })

  test('detects forced onboarding flag', () => {
    expect(
      shouldForceAlfredOnboarding({
        OPENCLAUDE_FORCE_ONBOARDING: 'true',
      }),
    ).toBe(true)
    expect(
      shouldForceAlfredOnboarding({
        OPENCLAUDE_FORCE_ONBOARDING: '0',
      }),
    ).toBe(false)
  })
})
