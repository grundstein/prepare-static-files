import { isVideoSource } from '../../src/lib.js'

const matches = ['mov', 'm4v']

const fails = ['mp4', 'webm', 'exe', 'dll']

export default {
  matches: matches.map(f => ({
    fn: isVideoSource(`file.${f}`),
    info: `file.${f} is a video source`,
  })),
  nonMatches: fails.map(f => ({
    fn: isVideoSource(`file.${f}`),
    expect: false,
    info: `file.${f} is not a video source`,
  })),
}
