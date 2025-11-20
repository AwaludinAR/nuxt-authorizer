import { describe, expect, it } from 'vitest'
import { allows, defineAbility, denies, authorize } from '../src/runtime/utils'

describe('Authorizer', () => {
  interface User {
    id: number
  }

  describe('allows', () => {
    const ability = defineAbility((user?: User) => !!user)
    it('Should return true', async () => {
      const result = await allows(ability, { id: 1 })
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await allows(ability)
      expect(result).toBe(false)
    })
  })

  describe('denies', () => {
    const ability = defineAbility((user: User) => user.id === 1)
    it('Should return true', async () => {
      const result = await denies(ability, { id: 0 })
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await denies(ability, { id: 1 })
      expect(result).toBe(false)
    })
  })

  describe('authorize', () => {
    const ability = defineAbility((user: User) => user.id === 1)

    it('Should pass authorize', async () => {
      expect(async () => authorize(ability, { id: 1 })).not.toThrow()
    })

    it('Should error', async () => {
      expect(async () => await authorize(ability, { id: 0 })).rejects.toThrow()
    })
  })
})
