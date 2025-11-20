import { defineNuxtPlugin } from '#app'
import { allows, denies, defineAbility } from './utils'

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      authorizer: { allows, denies, defineAbility },
    },
  }
})
