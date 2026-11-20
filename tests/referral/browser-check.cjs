const fs = require('node:fs/promises')
const path = require('node:path')
const Module = require('node:module')
const { pathToFileURL } = require('node:url')
const { createServer } = require('node:http')
const assert = require('node:assert/strict')
const runtime = process.env.REFERRAL_TEST_DEPS || __dirname
const dependencies = Module.createRequire(path.resolve(runtime, 'package.json'))
const css = dependencies.resolve('vuetify/dist/vuetify.min.css')
const bundle = process.env.REFERRAL_BROWSER_BUNDLE || path.resolve(runtime, 'referral-browser.js')
const referrer = '0x3333333333333333333333333333333333333333'
;(async () => {
  const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_PACKAGE).href)
  const server = createServer(async (request, response) => {
    const route = new URL(request.url, 'http://localhost').pathname
    if (route === '/fixture.js' || route === '/vuetify.css') {
      response.setHeader('Content-Type', route.endsWith('.js') ? 'text/javascript' : 'text/css')
      response.end(await fs.readFile(route.endsWith('.js') ? bundle : css))
    } else {
      response.setHeader('Content-Type', 'text/html')
      response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/vuetify.css"><link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></head><body><div id="app"></div><script src="/fixture.js"></script></body></html>')
    }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  let browser
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true })
    const base = `http://127.0.0.1:${server.address().port}`
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(`${base}/market?ref=${referrer}`)
      await page.waitForFunction(() => window.referralEvidence)
      await page.getByRole('link', { name: 'Asset', exact: true }).click()
      await page.waitForURL('**/asset')
      assert.equal(await page.evaluate(() => window.referralEvidence.store.state.referrer), referrer)
      await page.getByRole('button', { name: /Buy/ }).click()
      await page.waitForFunction(() => window.referralEvidence.calls.length === 1)
      const record = await page.evaluate(() => window.referralEvidence.calls[0])
      assert.equal(record.recipients[2], referrer)
      assert.deepEqual(record.fees, ['100', '451', '450'])
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      assert.deepEqual(errors, [])
      await page.locator('.v-dialog--active').waitFor({ state: 'visible' })
      await page.locator('.v-dialog--active').evaluate(async element => {
        await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished))
      })
      await page.screenshot({ path: path.resolve(process.env.EVIDENCE_DIR || runtime, `satellites-referral-${width}.png`) })
      console.log(JSON.stringify({ width, call: record, errors, overflow: false }))
      await page.close()
    }
    for (const query of [`ref=${referrer}&ref=${referrer}`, 'ref=0x123']) {
      const page = await browser.newPage()
      await page.goto(`${base}/asset?${query}`)
      await page.waitForFunction(() => window.referralEvidence)
      assert.equal(await page.evaluate(() => window.referralEvidence.store.state.referrer), null)
      await page.getByRole('button', { name: /Buy/ }).click()
      await page.waitForFunction(() => window.referralEvidence.calls.length === 1)
      const call = await page.evaluate(() => window.referralEvidence.calls[0])
      assert.equal(call.recipients.length, 2)
      assert.deepEqual(call.fees, ['100', '901'])
      await page.close()
    }
    console.log('4 mounted browser scenarios PASS')
  } finally {
    if (browser) await browser.close()
    await new Promise(resolve => server.close(resolve))
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
