import { describe, expect, it } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils'
import { fileURLToPath } from 'node:url'

describe('Component', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/components', import.meta.url)),
  })

  it('Should render correctly', async () => {
    const page = await createPage('/', {})

    expect(await page.getByTestId('can-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('as-can-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('can-invisible').isVisible()).toBeFalsy()

    expect(await page.getByTestId('cannot-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('as-cannot-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('cannot-invisible').isVisible()).toBeFalsy()

    expect(await page.getByTestId('authorizer-can-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('authorizer-can-invisible').isVisible()).toBeFalsy()
    expect(await page.getByTestId('authorizer-cannot-visible').isVisible()).toBeTruthy()
    expect(await page.getByTestId('authorizer-cannot-invisible').isVisible()).toBeFalsy()

    await page.close()
  })
})
