import type { Command } from '../../commands.js'

const alfredMemory: Command = {
  type: 'local-jsx',
  name: 'alfred-memory',
  aliases: ['memory-companion'],
  description: 'Configure Alfred memory companion integration',
  load: () => import('./memory.js'),
}

export default alfredMemory
