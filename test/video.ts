import { is } from '@magic/test'

import { video } from '../src/video.js'

export default [
  { fn: () => video, expect: is.fn },
  {
    fn: async () => {
      await video({ file: 'test/fixtures/test.mov', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'video converts a valid mov',
  },
  {
    fn: async () => {
      // test with force=true to cover force path
      await video({ file: 'test/fixtures/test.mov', force: true, silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'video converts with force=true',
  },
  {
    fn: async () => {
      await video({ file: 'test/fixtures/test.mov', silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'video logs when silent is false',
  },
]
