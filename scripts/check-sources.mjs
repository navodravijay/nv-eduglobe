import { readFileSync } from 'node:fs'

// A maintenance check, never part of the running application.
const source = readFileSync(new URL('../src/data/places.ts', import.meta.url), 'utf8')
const urls = [...new Set([...source.matchAll(/url: '([^']+)'/g)].map((match) => match[1]))]
let failures = 0
for (let offset = 0; offset < urls.length; offset += 4) {
  await Promise.all(
    urls.slice(offset, offset + 4).map(async (url) => {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
        console.log(`${response.status} ${url}`)
        await response.body?.cancel()
        if (!response.ok) failures++
      } catch (error) {
        failures++
        console.log(`UNREACHABLE ${url}: ${error.message}`)
      }
    }),
  )
}
console.log(
  `${urls.length} source URLs checked; ${failures} need review (blocking or bot protection may apply).`,
)
process.exitCode = failures ? 1 : 0
