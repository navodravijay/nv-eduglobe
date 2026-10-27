import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'

test('production content security policy permits the globe and learning tools', async ({
  page,
  baseURL,
}) => {
  const headerFile = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  const policy = headerFile
    .split('\n')
    .find((line) => line.trim().startsWith('Content-Security-Policy:'))!
    .trim()
    .slice('Content-Security-Policy:'.length)
    .trim()
  await page.route(`${baseURL}/`, async (route) => {
    const response = await route.fetch()
    await route.fulfill({
      response,
      headers: { ...response.headers(), 'content-security-policy': policy },
    })
  })
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', () => {
      document.documentElement.dataset.cspViolation = 'yes'
    })
  })
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page.getByRole('tab', { name: /Geography challenge/ }).click()
  await page.getByRole('button', { name: 'Let’s find out' }).click()
  await expect(
    page.getByRole('heading', { name: 'Which is the largest continent by land area?' }),
  ).toBeVisible()
  expect(await page.locator('html').getAttribute('data-csp-violation')).toBeNull()
})

test('loads a real textured globe, responsive homepage and local assets', async ({
  page,
  baseURL,
}, testInfo) => {
  const errors: string[] = []
  const externalRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (!request.url().startsWith(`${baseURL}/`)) externalRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A world of')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.locator('.place-card')).toHaveCount(6)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect(
    await page
      .locator('img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth > 0,
        ),
      ),
  ).toBe(true)
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
  await page.waitForTimeout(2200) // Capture after the camera's cinematic reveal.
  await page.screenshot({ path: `test-results/${testInfo.project.name}-hero.png`, scale: 'css' })
  // Bring lazy photographs into view and verify decoding before the full-page capture.
  for (const photo of await page.locator('img').all()) {
    await photo.scrollIntoViewIfNeeded()
    await expect(photo).toHaveJSProperty('complete', true)
    await expect
      .poll(() => photo.evaluate((node) => (node as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-homepage.png`,
    fullPage: true,
    scale: 'css',
  })
})

test('searches, filters, handles empty results and opens an accessible guide', async ({ page }) => {
  await page.goto('/#explore')
  const search = page.getByRole('searchbox')
  await search.fill('Sigiriya')
  await expect(page.locator('.place-card')).toHaveCount(1)
  await page.locator('.place-card').click()
  await expect(page.getByRole('dialog', { name: 'Sigiriya' })).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('1982')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await search.fill('does-not-exist')
  await expect(page.getByText('A little off the map.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.getByRole('combobox', { name: 'Continents', exact: true }).selectOption('africa')
  await page.getByRole('combobox', { name: 'All categories' }).selectOption('heritage')
  await expect(page.locator('.place-card')).toHaveCount(1)
  await expect(page.locator('.place-card')).toContainText('Pyramids of Giza')
})

test('switches essential UI and educational content into Sinhala and back', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'si')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('සොයා යන්න')
  await page.getByRole('searchbox').fill('සීගිරිය')
  await expect(page.locator('.place-card')).toHaveCount(1)
  await page.locator('.place-card').click()
  await expect(page.getByRole('dialog', { name: 'සීගිරිය' })).toContainText('කාශ්‍යප')
  await page.getByRole('button', { name: 'වසන්න', exact: true }).click()
  await page.getByRole('button', { name: 'භාෂාව වෙනස් කරන්න' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('scores all ten answers, explains answers and restarts the quiz', async ({ page }) => {
  await page.goto('/#learn')
  await page.getByRole('tab', { name: /Geography challenge/ }).click()
  await page.getByRole('button', { name: 'Let’s find out' }).click()
  const correct = [1, 3, 0, 2, 1, 0, 2, 3, 1, 2]
  for (let index = 0; index < correct.length; index++) {
    await expect(page.getByRole('button', { name: 'Check answer' })).toBeDisabled()
    await page.getByRole('radio').nth(correct[index]).check()
    await page.getByRole('button', { name: 'Check answer' }).click()
    await expect(page.getByRole('status')).toContainText('That’s right!')
    await page
      .getByRole('button', { name: index === 9 ? 'See my results' : 'Next question' })
      .click()
  }
  await expect(page.locator('.score-value')).toHaveText('10/ 10')
  await page.getByRole('button', { name: 'Play again' }).click()
  await expect(
    page.getByRole('heading', { name: 'Which is the largest continent by land area?' }),
  ).toBeVisible()
})

test('tour travels, pauses, advances manually and ends', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page.getByRole('button', { name: 'Take a world tour' }).click()
  await expect(page.locator('.tour-destination')).toContainText('Sigiriya')
  await page.getByRole('button', { name: 'Pause tour', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Resume tour', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Next stop', exact: true }).click()
  await expect(page.locator('.tour-destination')).toContainText('Pyramids of Giza')
  await page.getByRole('button', { name: 'Resume tour', exact: true }).click()
  await expect(page.locator('.tour-destination')).toContainText('Eiffel Tower', { timeout: 16000 })
  await page.getByRole('button', { name: 'End tour', exact: true }).click()
  await expect(page.locator('.tour-panel')).toHaveCount(0)
})

test('WebGL unavailable keeps destination and quiz features usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.getByText('Discovery is still within reach.')).toBeVisible()
  await page.getByRole('searchbox').fill('Kandy')
  await page.locator('.place-card').click()
  await expect(page.getByRole('dialog', { name: 'Kandy' })).toContainText('Sacred Tooth')
})

test('reduced motion, keyboard globe controls and expanded view work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await expect(page.getByRole('button', { name: 'Auto-rotate', exact: true })).toBeDisabled()
  const globe = page.getByRole('application')
  await globe.focus()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('+')
  await page.keyboard.press('Home')
  await page.getByRole('button', { name: 'Expand globe', exact: true }).click()
  await expect(page.locator('.globe-shell')).toHaveClass(/expanded/)
  await page.keyboard.press('Escape')
  await expect(page.locator('.globe-shell')).not.toHaveClass(/expanded/)
})

test('texture failure and context loss show a working retry', async ({ page }) => {
  await page.route('**/assets/earth.jpg', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByText('Discovery is still within reach.')).toBeVisible()
  await page.unroute('**/assets/earth.jpg')
  await page.getByRole('button', { name: 'Try the globe again' }).click()
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page
    .locator('canvas')
    .evaluate((canvas) =>
      (canvas as HTMLCanvasElement)
        .getContext('webgl2')
        ?.getExtension('WEBGL_lose_context')
        ?.loseContext(),
    )
  await expect(page.getByText('Discovery is still within reach.')).toBeVisible()
  await page.getByRole('searchbox').fill('Ella')
  await expect(page.locator('.place-card')).toHaveCount(1)
})

test('navigation and Sinhala layouts remain usable at narrow and tablet widths', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.locator('.main-nav').getByRole('link', { name: 'Learn', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'A little wonder. A lot to learn.' }),
  ).toBeInViewport()
  await page.getByRole('button', { name: 'Change language' }).click()
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})
