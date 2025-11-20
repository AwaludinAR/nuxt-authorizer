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

    await page.close()
  })
})
