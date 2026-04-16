import type { ProviderPreset } from './providerProfiles.js'

export type AlfredAuthChoice =
  | 'anthropic'
  | 'ollama'
  | 'openai'
  | 'openai-codex'
  | 'chatgpt-oauth'
  | 'openrouter'
  | 'custom'

export type AlfredProviderChoice = ProviderPreset | 'codex-oauth'

export const ALFRED_ONBOARDING_FORCE_ENV = 'OPENCLAUDE_FORCE_ONBOARDING'
export const ALFRED_AUTH_CHOICE_ENV = 'OPENCLAUDE_ONBOARD_AUTH_CHOICE'
export const ALFRED_MODEL_ENV = 'OPENCLAUDE_ONBOARD_MODEL'

function normalizeChoice(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? ''
}

export function resolveAlfredProviderChoice(
  choice: string | undefined,
): AlfredProviderChoice | undefined {
  switch (normalizeChoice(choice)) {
    case 'anthropic':
    case 'claude':
      return 'anthropic'
    case 'ollama':
    case 'local':
      return 'ollama'
    case 'openai':
      return 'openai'
    case 'openrouter':
      return 'openrouter'
    case 'custom':
    case 'openai-compatible':
      return 'custom'
    case 'openai-codex':
    case 'codex':
    case 'codex-oauth':
    case 'chatgpt-oauth':
    case 'chatgpt':
      return 'codex-oauth'
    default:
      return undefined
  }
}

export function getAlfredOnboardingPresetFromEnv(
  processEnv: NodeJS.ProcessEnv = process.env,
): AlfredProviderChoice | undefined {
  return resolveAlfredProviderChoice(processEnv[ALFRED_AUTH_CHOICE_ENV])
}

export function getAlfredOnboardingModelFromEnv(
  processEnv: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const model = processEnv[ALFRED_MODEL_ENV]?.trim()
  return model ? model : undefined
}

export function shouldForceAlfredOnboarding(
  processEnv: NodeJS.ProcessEnv = process.env,
): boolean {
  const value = normalizeChoice(processEnv[ALFRED_ONBOARDING_FORCE_ENV])
  return value === '1' || value === 'true' || value === 'yes'
}
