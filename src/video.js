import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'

import ffmpeg from 'fluent-ffmpeg'

// ffmpeg -i trailer.mov -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis trailer.webm

//for f in *.mp4; do
//  ffmpeg -i "$f" -map 0 -c copy -c:v libx264 -crf 23 -preset medium h264vids/"${f%.*}.mkv";
// done

// ffmpeg -i input -c:v libx264 -preset slow -crf 22 -x264-params keyint=123:min-keyint=20 -c:a copy output.mkv

// output is encoded to be byte-for-byte reproducible:
// - -fflags +bitexact (format level) keeps the muxer deterministic, e.g. it
//   stops the webm/mkv muxer from writing a random TrackUID per run. the
//   codec-level -flags +bitexact alone does not cover the muxer.
// - -threads 1 pins the encoder thread count. ffmpeg defaults to one thread
//   per core, and libx264/libvpx produce different bytes for different thread
//   counts, so auto threading would vary output with the machine's core count.
const convertFile = ({ file, force, silent, codec, ext }) =>
  new Promise(async (resolve, reject) => {
    const origExt = path.extname(file)
    const newFileName = file.replace(origExt, ext)
    const name = path.join(process.cwd(), newFileName)

    if (!force) {
      try {
        await fs.stat(name)
        resolve(false)
        return
      } catch (e) {}
    }

    if (!silent) {
      log.info('Converting', file)
    }

    ffmpeg(file)
      .addOutput(name)
      .videoCodec(codec)
      .withInputOptions(['-fflags +genpts'])
      .withOutputOptions([
        '-fflags +bitexact',
        '-flags +bitexact',
        '-map_metadata -1',
        '-map_chapters -1',
        '-threads 1',
      ])
      .on('end', () => resolve(true))
      .on('error', async err => {
        // ffmpeg may have created a partial or empty file before failing
        try {
          await fs.rmrf(name)
        } catch (e) {}
        reject(err)
      })
      .run()
  })

export const video = async ({ file, force, silent }) => {
  const mp4 = await convertFile({ file, force, codec: 'libx264', ext: '.mp4' })
  const webm = await convertFile({ file, force, codec: 'libvpx', ext: '.webm' })

  if ((mp4 || webm) && !silent) {
    log.info('wrote converted video files for:', file)
  }
}
