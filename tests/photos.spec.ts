import { expect, test } from '@playwright/test'

test.use({ deviceScaleFactor: 1, reducedMotion: 'reduce', trace: 'off' })

test('Sri Lanka thumbnails and Amazon photography load in guides in both languages', async ({
  page,
}, testInfo) => {
  // This focused asset/layout check also covers the non-WebGL experience.
  // Globe rendering is exercised separately in experience.spec.ts.
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
  await page.goto('/#sri-lanka')
  const rows = page.locator('.sl-place-list > button')
  await expect(rows).toHaveCount(5)
  for (const row of await rows.all()) {
    const photo = row.locator('img')
    await photo.evaluate((image) => image.scrollIntoView({ behavior: 'instant', block: 'center' }))
    await expect
      .poll(() => photo.evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    await expect(photo).toBeVisible()
  }
  await page
    .locator('.sl-place-list')
    .screenshot({ path: `test-results/${testInfo.project.name}-sri-lanka-photos.png` })
  for (const name of ['Kandy', 'Galle Fort', 'Ella', 'Colombo']) {
    await rows.filter({ has: page.locator('.sl-place-name', { hasText: name }) }).click()
    const guide = page.getByRole('dialog', { name, exact: true })
    await expect(guide).toBeVisible()
    const photo = guide.locator('.detail-photo img')
    await expect
      .poll(() => photo.evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    await expect(guide.locator('.photo-credit')).toHaveAttribute(
      'href',
      /^https:\/\/unsplash.com\/photos\//,
    )
    await page.keyboard.press('Escape')
  }
  await page.getByRole('searchbox').fill('Amazon')
  const card = page.locator('.place-card')
  await expect(card).toHaveCount(1)
  await expect(card.locator('img')).toHaveAttribute('src', '/assets/amazon.jpg')
  await card.click()
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', /rainforest.*Tefé/)
  await expect(page.getByRole('dialog').locator('.photo-credit')).toContainText(
    'Rodrigo Kugnharski',
  )
  await page
    .getByRole('dialog')
    .screenshot({ path: `test-results/${testInfo.project.name}-amazon-photo.png` })
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Change language' }).click()
  await card.click()
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', /ඇමසන්/)
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 320, height: 720 })
  await page
    .locator('.sl-place-list')
    .evaluate((list) => list.scrollIntoView({ behavior: 'instant' }))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  for (const row of await rows.all()) {
    expect(await row.evaluate((button) => button.scrollWidth <= button.clientWidth)).toBe(true)
  }
})
