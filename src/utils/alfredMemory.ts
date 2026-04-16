import { getGlobalConfig, saveGlobalConfig } from './config.js'

export const DEFAULT_ALFRED_MEMORY_ENDPOINT = 'http://127.0.0.1:37777'

export type AlfredMemoryStatus = {
  enabled: boolean
  endpoint: string
}

export function getAlfredMemoryStatus(): AlfredMemoryStatus {
  const config = getGlobalConfig()
  return {
    enabled: config.alfredMemoryEnabled === true,
    endpoint: config.alfredMemoryEndpoint || DEFAULT_ALFRED_MEMORY_ENDPOINT,
  }
}

export function setAlfredMemoryStatus(options: {
  enabled: boolean
  endpoint?: string
}): AlfredMemoryStatus {
  const endpoint = options.endpoint?.trim() || DEFAULT_ALFRED_MEMORY_ENDPOINT
  saveGlobalConfig(current => ({
    ...current,
    alfredMemoryEnabled: options.enabled,
    alfredMemoryEndpoint: endpoint,
  }))
  return {
    enabled: options.enabled,
    endpoint,
  }
}

async function probeUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

export async function probeAlfredMemoryEndpoint(
  endpoint: string,
): Promise<boolean> {
  const normalized = endpoint.replace(/\/+$/, '')
  return (
    (await probeUrl(`${normalized}/api/health`)) ||
    (await probeUrl(`${normalized}/health`))
  )
}
