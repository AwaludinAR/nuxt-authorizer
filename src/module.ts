import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addComponentsDir, addServerImportsDir } from '@nuxt/kit'

// Module options TypeScript interface definition

export interface ModuleOptions {
  autoImports: { components?: boolean, composables: boolean } | boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-authorizer',
    configKey: 'authorizer',
    compatibility: {
      nuxt: '>= 3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    autoImports: true,
  },
  setup(options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    /**
     * App
     */
    addImportsDir(resolve('runtime/utils'))
    if (typeof options.autoImports === 'boolean') {
      if (options.autoImports) {
        addImportsDir(resolve('runtime/app/composables'))
        addComponentsDir({
          path: resolve('runtime/app/components'),
          ignore: ['Primitive.ts'],
        })
      }
    }
    if (typeof options.autoImports === 'object') {
      if (options.autoImports.composables) {
        addImportsDir(resolve('runtime/app/composables'))
      }
      if (options.autoImports.components) {
        addComponentsDir({
          path: resolve('runtime/app/components'),
          ignore: ['Primitive.ts'],
        })
      }
    }

    /**
     * Server
     */
    addServerImportsDir(resolve('runtime/utils'))

    addPlugin(resolve('runtime/plugin'))
  },
})
