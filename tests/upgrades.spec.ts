import { expect, test } from '@playwright/test'

test('map layers change the rendered globe without recreating its canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  const canvas = page.locator('canvas')
  const original = await canvas.screenshot()
  await page.getByRole('button', { name: 'Map layers', exact: true }).click()
  const layers = page.getByRole('group', { name: 'Map layers', exact: true })
  const bounds = await layers.boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  await layers.getByRole('checkbox', { name: /Coordinate grid/ }).check()
  await expect.poll(async () => !(await canvas.screenshot()).equals(original)).toBe(true)
  await layers.getByRole('checkbox', { name: /Equator/ }).check()
  await layers.getByRole('checkbox', { name: /Destination markers/ }).uncheck()
  await expect(layers.getByRole('checkbox', { name: /Equator/ })).toBeChecked()
  await expect(canvas).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(layers).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Map layers', exact: true })).toBeFocused()
})

test('Sri Lanka presentation visits five stops and switches to a nature journey', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page
    .getByRole('button', { name: 'Begin journey: An island of stories', exact: true })
    .click()
  await expect(page.locator('.globe-shell')).toHaveClass(/expanded/)
  await expect(page.locator('.tour-destination')).toContainText('Sigiriya')
  await expect(page.locator('.tour-count')).toHaveText('01 / 05')
  await page.getByRole('button', { name: 'Pause tour', exact: true }).click()
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-presentation.png`,
    scale: 'css',
  })
  for (const name of ['Kandy', 'Galle Fort', 'Ella', 'Colombo', 'Sigiriya']) {
    await page.getByRole('button', { name: 'Next stop', exact: true }).click()
    await expect(page.locator('.tour-destination')).toContainText(name)
  }
  await page.getByRole('button', { name: 'Previous stop', exact: true }).click()
  await expect(page.locator('.tour-destination')).toContainText('Colombo')
  await page.getByRole('combobox', { name: 'Choose a journey' }).selectOption('nature')
  await expect(page.locator('.tour-destination')).toContainText('Mount Everest')
  await expect(page.locator('.tour-count')).toHaveText('01 / 04')
  await page.getByRole('combobox', { name: 'Travel pace' }).selectOption('20')
  await expect(page.getByRole('combobox', { name: 'Travel pace' })).toHaveValue('20')
  await page.getByRole('button', { name: 'End tour', exact: true }).click()
  await expect(page.locator('.tour-panel')).toHaveCount(0)
})

test('guide and layer Escape keys preserve the parent presentation until explicitly exited', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page
    .getByRole('button', { name: 'Begin journey: Around the extraordinary', exact: true })
    .click()
  await page.locator('.tour-destination').click()
  await expect(page.getByRole('dialog', { name: 'Sigiriya', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Sigiriya', exact: true })).toHaveCount(0)
  await expect(page.locator('.globe-shell')).toHaveClass(/expanded/)
  await page.getByRole('button', { name: 'Map layers', exact: true }).click()
  await page
    .getByRole('group', { name: 'Map layers', exact: true })
    .getByRole('checkbox')
    .first()
    .focus()
  await page.keyboard.press('Escape')
  await expect(page.locator('.layer-popover')).toHaveCount(0)
  await expect(page.locator('.globe-shell')).toHaveClass(/expanded/)
  await page.keyboard.press('Escape')
  await expect(page.locator('.globe-shell')).not.toHaveClass(/expanded/)
})

test('new journeys and layer controls work in Sinhala and photos recover from failure', async ({
  page,
}) => {
  await page.route('**/assets/giza.jpg', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.earth-ready')).toBeVisible({ timeout: 30000 })
  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByRole('heading', { name: 'කුතුහලයට මඟ පෙන්වන්න දෙන්න.' })).toBeVisible()
  const giza = page
    .locator('.place-card')
    .filter({ has: page.getByRole('heading', { name: 'ගීසා පිරමීඩ' }) })
  await giza.scrollIntoViewIfNeeded()
  await expect(giza.locator('.place-art')).toBeVisible()
  await page
    .getByRole('button', { name: 'සංචාරය අරඹන්න: කතාවලින් පිරි දූපතක්', exact: true })
    .click()
  await expect(page.locator('.tour-destination')).toContainText('සීගිරිය')
  await page.getByRole('button', { name: 'සිතියම් ස්තර', exact: true }).click()
  await page.getByRole('checkbox', { name: /සමකය/ }).check()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
