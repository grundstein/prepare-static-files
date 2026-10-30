import { is, fs } from '@magic/test'

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
  {
    fn: async () => {
      // reproducibility: converting the same source twice must yield
      // byte-identical output, so fixtures never change between test runs
      await video({ file: 'test/fixtures/test.mov', force: true, silent: true })
      const mp4a = await fs.readFile('test/fixtures/test.mp4')
      const webma = await fs.readFile('test/fixtures/test.webm')

      await video({ file: 'test/fixtures/test.mov', force: true, silent: true })

      const mp4b = await fs.readFile('test/fixtures/test.mp4')
      const webmb = await fs.readFile('test/fixtures/test.webm')

      if (!mp4a.equals(mp4b)) {
        throw new Error('video mp4 output is not reproducible')
      }

      if (!webma.equals(webmb)) {
        throw new Error('video webm output is not reproducible')
      }

      return 'ok'
    },
    expect: 'ok',
    info: 'video output is byte-identical across runs',
  },
]
