import * as React from 'react'
import { ProviderManager } from '../../components/ProviderManager.js'
import type { LocalJSXCommandCall } from '../../types/command.js'
import {
  resolveAlfredProviderChoice,
} from '../../utils/alfredOnboarding.js'

export function parseOnboardArgs(rawArgs: string | undefined): {
  initialPreset?: ReturnType<typeof resolveAlfredProviderChoice>
  initialModel?: string
} {
  const args = rawArgs?.trim() ?? ''
  if (!args) {
    return {}
  }

  const tokens = args.split(/\s+/)
  let initialPreset: ReturnType<typeof resolveAlfredProviderChoice>
  let initialModel: string | undefined

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token === '--auth-choice') {
      initialPreset = resolveAlfredProviderChoice(tokens[index + 1])
      index += 1
      continue
    }
    if (token.startsWith('--auth-choice=')) {
      initialPreset = resolveAlfredProviderChoice(
        token.slice('--auth-choice='.length),
      )
      continue
    }
    if (token === '--model') {
      initialModel = tokens[index + 1]
      index += 1
      continue
    }
    if (token.startsWith('--model=')) {
      initialModel = token.slice('--model='.length)
    }
  }

  return { initialPreset, initialModel }
}

export const call: LocalJSXCommandCall = async (onDone, _context, args) => {
  const { initialPreset, initialModel } = parseOnboardArgs(args)

  return (
    <ProviderManager
      mode="first-run"
      initialPreset={initialPreset}
      initialModel={initialModel}
      onDone={result => {
        onDone(
          result?.message ??
            (result?.action === 'saved'
              ? 'Alfred onboarding complete'
              : 'Alfred onboarding skipped'),
          { display: 'system' },
        )
      }}
    />
  )
}
