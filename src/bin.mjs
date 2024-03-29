#!/usr/bin/env node

import cli from '@magic/cli'
import { run } from './index.mjs'

const cliArgs = {
  options: [
    ['--dirs', '--dir', '-d'],
    ['--no-optimize-images', '--no-opt'],
    ['--no-compress', '--no-zip'],
    '--no-audio',
    '--no-video',
    '--no-etags',
    ['--silent', '--quiet', '-q'],
    '--no-webp',
    '--no-ply',
    ['--force', '-f'],
    ['--compress-min-percent', '--min-percent'],
  ],
  single: [
    '--no-optimize-images',
    '--no-compress',
    '--no-webp',
    '--no-audio',
    '--no-video',
    '--no-etags',
    '--no-ply',
    '--force',
    '--compress-min-percent',
  ],
  default: {
    '--dirs': ['docs'],
    '--compress-min-percent': 0.2,
    '--force': false,
  },
  help: {
    name: 'thesystem - prepare-static-files',
    header: 'sharp optimizes images, zopfli compresses other assets',
    options: {
      '--dirs': 'directories to work on.',
      '--no-optimize-images': 'do not sharp optimize images',
      '--no-compress': 'do not compress files',
      '--no-webp': 'do not generate webp files',
      '--no-audio': 'do not generate aac and ogg files from mp3s',
      '--no-video': 'do not generate mp4 and webm videos from source files',
      '--no-etags': 'do not generate public/etags.csv',
      '--no-ply': 'do not optimize ply files',
      '--silent': 'do not output info logs',
      '--force': 'regenerate files that exist.',
      '--compress-min-percent':
        'which size reduction percentage is needed for compressed files to be saved.',
    },
    example: `
# optimize and compress files
prepare-static-files

# do not optimize images
prepare-static-files --no-optimize-images
prepare-static-files --no-opt

# do not compress files
prepare-static-files --no-compress
prepare-static-files --no-zip

# do not create audio files from mp3s
prepare-static-files --no-audio

# show this help text
prepare-static-files --help
`,
  },
}

const { args } = cli(cliArgs)

run(args)
