import path from 'path'

import is from '@magic/types'
import log from '@magic/log'

import fs from '@magic/fs'
import sharp from 'sharp'

const jpegOptions = {
  trellisQuanttisation: true,
  quality: 80,
  optimizeCoding: true,
}

export const optimizeImage = async ({ file, silent, noWebp }) => {
  const sharpen = await sharp(file)

  const originalBuffer = await sharpen.toBuffer()

  if (is.undefined(noWebp)) {
    const extension = path.extname(file)
    const webpName = file.replace(extension, '.webp')
    const webpExists = await fs.exists(webpName)
    if (!webpExists) {
      if (!silent) {
        log.info('generate webp', webpName)
      }

      const sharpen = await sharp(file)
      await sharpen.toFile(webpName)
    }
  }

  let data

  if (file.endsWith('jpg')) {
    data = await sharpen.jpeg(jpegOptions)
  } else if (file.endsWith('png')) {
    data = await sharpen.png()
  } else {
    return
  }

  const buffer = await data.toBuffer()

  // make sure we do not write a file bigger than before
  if (buffer.length >= originalBuffer.length) {
    return
  }

  await fs.writeFile(file, buffer)

  if (!silent) {
    log.info(file, 'oldSize:', originalBuffer.length, 'newSize:', buffer.length)
  }
}
