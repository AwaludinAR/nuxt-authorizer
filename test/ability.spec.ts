import { defineAbility } from '../src/runtime/utils'
import { describe, expect, it } from 'vitest'

describe('Ability', () => {
  describe('Simple ability', () => {
    it('Should return true', async () => {
      const ability = defineAbility(() => true)
      const result = await ability()
      expect(result).toBe(true)
    })

    it('Should handle async', async () => {
      const asyncAbility = defineAbility(async () => Promise.resolve(true))
      const result = await asyncAbility()
      expect(result).toBe(true)
    })
  })

  describe('Ability with params', () => {
    const ability = defineAbility((arg?: number) => !!arg && arg > 0)

    it('Should return true', async () => {
      const result = await ability(1)
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await ability()
      expect(result).toBe(false)
    })

    it('Should handle async', async () => {
      const asyncAbility = defineAbility(async (arg: number) => Promise.resolve(arg > 0))
      const result = await asyncAbility(1)
      expect(result).toBe(true)
    })
  })

  describe('Nested ability', () => {
    const ability = defineAbility(() => ({
      a: () => true,
      b: (bArg1: number, bArg2?: number) => bArg1 === bArg2,
      c: (cArg?: string) => ({ c1: (c1Arg: number) => !!cArg && c1Arg > 0 }),
    }))

    it('Should return true', async () => {
      const result = await ability('a')
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await ability('b', 1)
      expect(result).toBe(false)
    })

    it('Should support deeply', async () => {
      const result = await ability('c', 'STR', 'c1', 1)
      expect(result).toBe(true)
    })

    it('Should handle async', async () => {
      const ab = defineAbility((str: string) => ({
        a: async () => Promise.resolve({
          a1: async (a1Arg: number) => Promise.resolve(str.length === a1Arg),
        }),
        b: async () => Promise.resolve(str.length > 0),
      }))
      const result = await ab('STR', 'a', 'a1', 3)
      expect(result).toBe(true)
    })
  })

  describe('Ability with nested array ability', () => {
    const arr1 = defineAbility([
      (exec: boolean) => exec,
      () => true,
      async (str?: string) => Promise.resolve(!!str),
      () => [async (num: number) => Promise.resolve(num > 0)],
    ] as const)
    it('Should return true', async () => {
      const result = await arr1([true], [], ['STR'], [[1]])
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await arr1([true], [], [], [])
      expect(result).toBe(false)
    })

    it('Should support deeply', async () => {
      const deepAbility = defineAbility((exec: boolean) => [
        () => exec,
        async () => Promise.resolve(true),
        (a: number) => [
          (a1: number) => a === a1,
          async (a1: number, a2: number) => Promise.resolve(a > 0 && a1 === a2),
        ],
        (b: string) => ({
          b1: (b1Arg: number) => b.length === b1Arg,
          b2: (b2Arg: string, b3Arg: number) => b === b2Arg && b3Arg > 0,
        }),
      ] as const)
      const result = await deepAbility(true, [], [], [2, [2], [1, 1]], ['STR', 'b2', 'STR', 1])
      expect(result).toBe(true)
    })

    it('Should handle infinite recursive', async () => {
      const arr = () => [arr]
      const inf = defineAbility((_exec: boolean) => [arr])
      await expect(async () => await inf(true)).rejects.toThrow()
    })
  })

  // Array Abilities
  describe('Array abilities', () => {
    const arr1 = defineAbility([
      (on: boolean) => on,
      () => [],
      async () => Promise.resolve(true),
    ] as const)
    it('Should return true', async () => {
      const result = await arr1([true], [], [])
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await arr1([false], [], [])
      expect(result).toBe(false)
    })

    it('Should handle infinite recursive', async () => {
      const arr = () => [arr]
      const inf = defineAbility(arr)
      await expect(async () => await inf()).rejects.toThrow()
    })
  })

  describe('Nested array abilities', async () => {
    const ability = defineAbility([
      (on: boolean) => on,
      () => [
        () => [
          async (end: number) => Promise.resolve(end > 0),
        ],
      ],
    ] as const)

    it('Should return true', async () => {
      const result = await ability([true], [[[1]]])
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await ability([true], [[[0]]])
      expect(result).toBe(false)
    })
  })

  describe('Array abilities with nested ability', () => {
    const ability = defineAbility([
      () => ({
        a: (a1: number) => ({
          aa: (aa1: number) => a1 === aa1,
        }),
      }),
      (r: string) => ({
        ra: (ra1: string) => ({
          raa: async (raa1: number) => Promise.resolve(r === ra1 && ra1.length === raa1),
        }),
      }),
    ] as const)

    it('Should return true', async () => {
      const result = await ability(['a', 2, 'aa', 2], ['STR', 'ra', 'STR', 'raa', 3])
      expect(result).toBe(true)
    })

    it('Should return false', async () => {
      const result = await ability(['a', 2, 'aa', 1], ['STR', 'ra', 'STR', 'raa', 3])
      expect(result).toBe(false)
    })
  })
})
