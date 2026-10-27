import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

// Browser profiles can be large. Keep temporary QA files on the project drive.
const temp = resolve('.tmp')
mkdirSync(temp, { recursive: true })
const child = spawn(
  process.execPath,
  [resolve('node_modules/@playwright/test/cli.js'), 'test', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: { ...process.env, TMP: temp, TEMP: temp, TMPDIR: temp },
  },
)
child.on('error', (error) => {
  console.error(error.message)
  process.exitCode = 1
})
child.on('exit', (code) => {
  process.exitCode = code ?? 1
})
