import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'

import ffmpeg from 'fluent-ffmpeg'

// ffmpeg -i input.mp3 -c:a aac -b:a 192k output.m4a

const convertFile = async ({ file, codec, ext }) => {
  const origExt = path.extname(file)
  const newFile = file.replace(origExt, ext)
  const name = path.join(process.cwd(), newFile)

  if (newFile === file) {
    // same extension: output would overwrite the input file, nothing to do
    return false
  }

  const exists = await fs.exists(name)
  if (exists) {
    return false
  }

  return new Promise((res, rej) => {
    ffmpeg(file)
      .addOutput(name)
      //.audioBitrate(192)
      .audioCodec(codec)
      .on('end', () => res(true))
      .on('error', rej)
      .run()
  })
}

export const audio = async ({ file, silent }) => {
  const status = await Promise.all([
    convertFile({ file, codec: 'aac', ext: '.mp4' }),
    convertFile({ file, codec: 'libmp3lame', ext: '.mp3' }),
  ])

  if (status.includes(true) && !silent) {
    log.info('wrote converted audio files for:', file)
  }
}
