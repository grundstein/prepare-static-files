import { isCompressible } from '../../src/lib.js'

const compressibleExts = ['html', 'css', 'js', 'json', 'xml', 'txt', 'svg', 'csv']

const nonCompressibleExts = ['png', 'jpg', 'jpeg', 'mp4', 'webm', 'zip']

export default {
  matches: compressibleExts.map(f => ({
    fn: isCompressible(`file.${f}`),
    expect: true,
    info: `file.${f} is compressible`,
  })),
  nonMatches: nonCompressibleExts.map(f => ({
    fn: isCompressible(`file.${f}`),
    expect: false,
    info: `file.${f} is not compressible`,
  })),
}
