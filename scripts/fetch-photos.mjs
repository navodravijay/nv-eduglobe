import { mkdir, writeFile } from 'node:fs/promises'

// Optional maintenance helper. Licenses and provenance are recorded in ASSETS.md.
const assets = [
  ['everest', 'photo-1741257067896-18b4b688766f'],
  ['giza', 'photo-1632836388763-3a52d354cd7e'],
  ['reef', 'photo-1638580591001-8c07e6f54097'],
  ['machu-picchu', 'photo-1501371632240-5d60b49290e7'],
  ['kandy', 'photo-1665849050430-5e8c16bacf7e'],
  ['galle', 'photo-1767710048839-4bead77ab4a5'],
  ['ella', 'photo-1656314945066-edca54a983ec'],
  ['colombo', 'photo-1742277712561-2cfe3422bdf7'],
  ['amazon', 'photo-1534861542011-27e852f7c9f5'],
]
const requested = process.argv.slice(2)
if (requested.some((name) => !assets.some(([assetName]) => assetName === name))) {
  throw new Error('Unknown asset name. Use a filename from the assets list without its extension.')
}
await mkdir('public/assets', { recursive: true })
await Promise.all(
  assets
    .filter(([name]) => !requested.length || requested.includes(name))
    .map(async ([name, id]) => {
      const response = await fetch(
        `https://images.unsplash.com/${id}?auto=format&fit=crop&fm=jpg&q=82&w=1200`,
        { signal: AbortSignal.timeout(30000) },
      )
      if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error(`${name}: expected JPEG`)
      await writeFile(`public/assets/${name}.jpg`, buffer)
      console.log(`${name}.jpg: ${buffer.length} bytes`)
    }),
)
