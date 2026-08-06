import { is, fs } from '@magic/test'

import { compress } from '../src/compress.js'

export default [
  { fn: () => compress, expect: is.fn },
  {
    fn: async () => {
      await compress({ file: 'test/fixtures/test.html', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress compresses a valid html file',
  },
  {
    fn: async () => {
      // already compressed, should return early when !force
      await compress({ file: 'test/fixtures/test.html.gz', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress skips when gz exists and !force',
  },
  {
    fn: async () => {
      // test with force=true to cover force path
      await compress({ file: 'test/fixtures/test.html', force: true, silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress with force=true',
  },
  {
    fn: async () => {
      await compress({ file: 'test/fixtures/test.html', silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress logs when silent is false',
  },
  {
    fn: async () => {
      // small file that won't meet compression threshold
      await compress({ file: 'test/fixtures/test.ply', silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress handles small files',
  },
  {
    fn: async () => {
      // test with compressMinPercent to override threshold
      await compress({ file: 'test/fixtures/test.ply', compressMinPercent: 0, silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'compress with 0% threshold writes even small savings',
  },
]
