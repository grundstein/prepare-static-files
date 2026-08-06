import { is, tryCatch } from '@magic/test'

import prepare from '../src/index.js'

export default [
  { fn: () => prepare, expect: is.fn },
  { fn: tryCatch(prepare), expect: is.error },
]
