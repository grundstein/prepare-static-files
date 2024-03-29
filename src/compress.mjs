import log from '@magic/log'
import fs from '@magic/fs'

import zopfli from 'node-zopfli-es'

export const compress = async ({ file, force, silent, compressMinPercent = 0.1 }) => {
  const outputName = `${file}.gz`

  const zipExists = await fs.exists(outputName)
  if (zipExists && !force) {
    return
  }

  const input = await fs.readFile(file)

  const options = {
    verbose: false,
    verbose_more: false,
    numiterations: 15,
    blocksplitting: true,
    blocksplittinglast: false,
    blocksplittingmax: 15,
  }

  const zipped = await zopfli.gzip(input, options)

  const compressPercent = compressMinPercent <= 1 ? compressMinPercent : compressMinPercent / 100
  const requiredSizeReduction = input.length * compressPercent

  const difference = input.length - zipped.length
  const kbMinimum = 512000

  log.info('Checking', file, 'for compression')

  if (difference > requiredSizeReduction || difference > kbMinimum) {
    await fs.writeFile(outputName, zipped)

    if (!silent) {
      log.info('Wrote compressed file:', outputName)
    }
  } else {
    if (!silent) {
      log.warn('ZIP', `less than 10% and less than 512kb smaller. ignoring`, file)

      // delete file, if it exists
      try {
        await fs.rmrf(outputName)
      } catch (e) {}
    }
  }
}
