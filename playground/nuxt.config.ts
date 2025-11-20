export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  app: { head: { title: 'Nuxt Authorizer Playground' } },
  compatibilityDate: '2025-11-17',
  authorizer: {},
})
