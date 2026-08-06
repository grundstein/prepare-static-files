import { is } from '@magic/test'

import { optimizeImage } from '../src/optimizeImage.js'

export default [
  { fn: () => optimizeImage, expect: is.fn },
  {
    fn: async () => {
      await optimizeImage({ file: 'test/fixtures/test.png', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'optimizeImage optimizes a valid png',
  },
  {
    fn: async () => {
      await optimizeImage({ file: 'test/fixtures/test.png', noWebp: true, silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'optimizeImage with noWebp',
  },
  {
    fn: async () => {
      await optimizeImage({ file: 'test/fixtures/test.png', silent: false })
      return 'ok'
    },
    expect: 'ok',
    info: 'optimizeImage logs when silent is false',
  },
  {
    fn: async () => {
      // test with jpg file
      await optimizeImage({ file: 'test/fixtures/test.jpg', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'optimizeImage handles jpg files',
  },
  {
    fn: async () => {
      // webp file should return early (not jpg or png)
      await optimizeImage({ file: 'test/fixtures/test.webp', silent: true })
      return 'ok'
    },
    expect: 'ok',
    info: 'optimizeImage returns early for webp',
  },
]
