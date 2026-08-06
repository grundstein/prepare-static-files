import { isGltf } from '../../src/lib.js'

const matches = ['gltf']

const fails = ['json', 'glb', 'png', 'jpg', 'exe']

export default {
  matches: matches.map(f => ({ fn: isGltf(`file.${f}`), info: `file.${f} is a gltf` })),
  nonMatches: fails.map(f => ({
    fn: isGltf(`file.${f}`),
    expect: false,
    info: `file.${f} is not a gltf`,
  })),
}
