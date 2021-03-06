import log from '@magic/log'
import fs from '@magic/fs'
import is from '@magic/types'

import { isImage, isLossLess, isVideoSource, isCompressible } from './lib.mjs'

import { optimizeImage } from '../src/optimizeImage.mjs'
import { compress } from '../src/compress.mjs'
import { audio } from './audio.mjs'
import { video } from './video.mjs'

const handleFiles = args => {
  const { noOptimizeImages, noAudio, noCompress, noVideo } = args

  return async file => {
    try {
      if (is.undefined(noOptimizeImages) && isImage(file)) {
        await optimizeImage({ ...args, file })
      }

      if (is.undefined(noAudio) && isLossLess(file)) {
        await audio({ ...args, file })
      }

      if (is.undefined(noVideo) && isVideoSource(file)) {
        await video({ ...args, file })
      }

      // '' is set if --no-compress is passed, otherwise noCompress
      if (is.undefined(noCompress) && isCompressible(file)) {
        await compress({ ...args, file })
      }
    } catch (e) {
      log.error(e, 'error processing file', file)
    }
  }
}

export const handleEntryPoints = args => async dir => {
  const fileHandler = handleFiles(args)

  const files = await fs.getFiles(dir, false)
  await Promise.all(files.map(fileHandler))

  let dirs = await fs.getDirectories(dir, 1)

  dirs = dirs.filter(d => d !== dir)
  const entryPointHandler = handleEntryPoints(args)
  await Promise.all(dirs.map(entryPointHandler))
}

export const run = async args => {
  const { dirs } = args

  log.info('prepare-static-files started')

  const handleEntries = handleEntryPoints(args)
  await Promise.all(dirs.map(handleEntries))

  log.success('prepare-static-files done')
}
