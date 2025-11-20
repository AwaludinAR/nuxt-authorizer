import { createError } from 'h3'
import type { Ability } from '../types'

export async function allows<A extends Ability<any>>(ability: A, ...args: Parameters<A>) {
  return await ability(...args)
}

export async function denies<A extends Ability<any>>(ability: A, ...args: Parameters<A>) {
  return !(await ability(...args))
}

export async function authorize<A extends Ability<any>>(ability: A, ...args: Parameters<A>) {
  const result = await ability(...args)
  const options = ability.options
  if (!result) {
    throw createError({
      statusCode: options?.statusCode || 401,
      message: options?.message || 'Unauthorized',
    })
  }
}
