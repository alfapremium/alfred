import type { Command } from '../../commands.js'

const onboard: Command = {
  type: 'local-jsx',
  name: 'onboard',
  aliases: ['alfred-onboard'],
  description: 'Run Alfred provider onboarding',
  load: () => import('./onboard.js'),
}

export default onboard
