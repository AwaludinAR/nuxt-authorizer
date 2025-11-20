import { describe, expect, it } from 'vitest'
import { defineAbility } from '../src/runtime/utils'
import { useAbility } from '../src/runtime/app/composables/useAbility'

describe('Composable', () => {
  describe('useAbility', () => {
    interface User {
      id: number
    }
    const ability = defineAbility((user?: User) => !!user)
    it('Should authorized true if the user is authorized', async () => {
      const { authorized, execute } = useAbility(ability)
      await execute({ id: 1 })
      expect(authorized.value).toBe(true)
    })

    it('Should authorized false if the user is unauthorized', async () => {
      const { authorized, execute } = useAbility(ability)
      await execute()
      expect(authorized.value).toBe(false)
    })

    it('Should handle multiple ability', async () => {
      const newAbility = defineAbility(async () => Promise.resolve(true))
      const { authorized, execute } = useAbility([ability, newAbility])
      await execute([{ id: 1 }])
      expect(authorized.value).toBe(true)
    })
  })
})
