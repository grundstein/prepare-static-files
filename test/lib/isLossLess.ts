import { isLossLess } from '../../src/lib.js'

const matches = ['flac', 'alac', 'wav']

const fails = ['m4a', 'mp3', 'exe', 'dll']

export default {
  matches: matches.map(f => ({ fn: isLossLess(`file.${f}`), info: `file.${f} is lossless audio` })),
  nonMatches: fails.map(f => ({
    fn: isLossLess(`file.${f}`),
    expect: false,
    info: `file.${f} is not lossless audio`,
  })),
}
