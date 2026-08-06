import { is } from '@magic/test'

import { audio } from '../src/audio.js'

export default [
  { fn: () => audio, expect: is.fn },
  {
    fn: async () => {
      await audio({ file: 'test/fixtures/test.mp3', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'audio converts a valid mp3',
  },
  {
    fn: async () => {
      await audio({ file: 'test/fixtures/test.mp3', silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'audio logs when silent is false',
  },
]
