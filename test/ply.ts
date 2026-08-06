import { is } from '@magic/test'

import { ply } from '../src/ply.js'

export default [
  { fn: () => ply, expect: is.fn },
  {
    fn: async () => {
      await ply({ file: 'test/fixtures/test.ply' })
      return 'ok'
    },
    expect: 'ok',
    info: 'ply optimizes a valid ply file',
  },
]
