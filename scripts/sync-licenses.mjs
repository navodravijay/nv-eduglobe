import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { resolve, sep } from 'node:path'

const root = resolve('.')
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
const destination = resolve(root, 'public/licenses')
mkdirSync(destination, { recursive: true })
const notices = []
for (const [packagePath, entry] of Object.entries(lock.packages)) {
  if (!packagePath.startsWith('node_modules/') || entry.dev) continue
  const directory = resolve(root, packagePath)
  if (!directory.startsWith(resolve(root, 'node_modules') + sep))
    throw new Error('Invalid package path')
  if (!existsSync(directory)) throw new Error(`Install dependencies first: ${packagePath}`)
  const info = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'))
  const files = readdirSync(directory, { withFileTypes: true }).filter(
    (file) => file.isFile() && /^(licen[sc]e|copying|notice)([.-]|$)/i.test(file.name),
  )
  const copied = []
  for (const file of files) {
    const target = `${packagePath.replaceAll('node_modules/', '').replaceAll('/', '__').replaceAll('@', '')}--${file.name}`
    copyFileSync(resolve(directory, file.name), resolve(destination, target))
    copied.push(target)
  }
  notices.push({
    name: info.name,
    version: info.version,
    license: info.license ?? entry.license ?? 'See upstream package',
    files: copied,
  })
}
writeFileSync(resolve(destination, 'NOTICE.json'), JSON.stringify(notices, null, 2) + '\n')
console.log(`Bundled license notices for ${notices.length} production packages.`)
