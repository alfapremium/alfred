import * as React from 'react'
import { Select } from '../../components/CustomSelect/index.js'
import { Dialog } from '../../components/design-system/Dialog.js'
import { Box, Text } from '../../ink.js'
import type { LocalJSXCommandCall } from '../../types/command.js'
import {
  getAlfredMemoryStatus,
  probeAlfredMemoryEndpoint,
  setAlfredMemoryStatus,
} from '../../utils/alfredMemory.js'

function AlfredMemoryCommand({
  onDone,
}: {
  onDone: (message?: string, options?: { display?: 'system' }) => void
}): React.ReactNode {
  const status = getAlfredMemoryStatus()
  const [message, setMessage] = React.useState<string | undefined>()

  return (
    <Dialog title="Alfred Memory" onCancel={() => onDone('Alfred memory setup closed', { display: 'system' })}>
      <Box flexDirection="column" gap={1}>
        <Text>
          Connect Alfred to a running Claude-Mem compatible worker without bundling
          its plugin runtime into the core CLI.
        </Text>
        <Text dimColor>
          Endpoint: {status.endpoint} · {status.enabled ? 'enabled' : 'disabled'}
        </Text>
        {message ? <Text>{message}</Text> : null}
        <Select
          options={[
            {
              value: 'check',
              label: 'Check companion',
              description: 'Probe the configured worker endpoint',
            },
            {
              value: 'enable',
              label: 'Enable companion',
              description: 'Save this endpoint for Alfred memory integration',
            },
            {
              value: 'disable',
              label: 'Disable companion',
              description: 'Keep Alfred core-only with no memory companion',
            },
            {
              value: 'done',
              label: 'Done',
              description: 'Return to chat',
            },
          ]}
          onChange={value => {
            if (value === 'done') {
              onDone('Alfred memory setup complete', { display: 'system' })
              return
            }
            if (value === 'disable') {
              setAlfredMemoryStatus({ enabled: false, endpoint: status.endpoint })
              onDone('Alfred memory companion disabled', { display: 'system' })
              return
            }

            void (async () => {
              const healthy = await probeAlfredMemoryEndpoint(status.endpoint)
              if (!healthy) {
                setMessage(
                  'No Claude-Mem compatible worker responded. Start the companion service first, then retry.',
                )
                return
              }

              if (value === 'check') {
                setMessage('Companion worker is reachable and ready.')
                return
              }

              setAlfredMemoryStatus({ enabled: true, endpoint: status.endpoint })
              onDone(
                `Alfred memory companion enabled at ${status.endpoint}`,
                { display: 'system' },
              )
            })()
          }}
          onCancel={() => onDone('Alfred memory setup closed', { display: 'system' })}
          visibleOptionCount={4}
        />
      </Box>
    </Dialog>
  )
}

export const call: LocalJSXCommandCall = async onDone => {
  return <AlfredMemoryCommand onDone={onDone} />
}
