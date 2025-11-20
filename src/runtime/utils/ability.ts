import type { Ability, AbilityParams, Rule, RuleOptions } from '../types'

async function executor(rule: Rule | Rule[], args: any[], depth = 0) {
  // Handle infinite recursion
  if (depth > 50) throw new Error('Max recursion depth exceeded')

  args = Array.isArray(args[0]) ? args[0] : args

  // ----- Single rule -----
  if (Array.isArray(rule)) {
    for (let i = 0; i < rule.length; i++) {
      const [nextRule, nextArgs] = [rule[i], args[i]]

      // Should return false?
      if (!nextRule) continue

      const ok = await executor(nextRule, nextArgs || [], depth + 1)
      if (!ok) return false
    }
    return true
  }

  // ----- Single rule -----
  const result = await rule(...(Array.isArray(args) ? args : [args]))
  if (typeof result === 'boolean') return result

  // ----- Nested array rules
  if (Array.isArray(result)) {
    const nextArgs = args.slice(rule.length)
    return executor(result, [nextArgs], depth + 1)
  }

  const [key, ...rest] = args.slice(rule.length)
  const nextRule = result[key]
  if (!nextRule) return false

  return executor(nextRule, rest, depth + 1)
}

export function defineAbility<R extends Rule | Rule[], O extends RuleOptions<R>>(rule: R, options?: O): Ability<R> {
  const ability = async (...args: AbilityParams<R>) => {
    const opts = (ability as Ability<R>).options
    const execute = opts?.executor || executor
    const result = await execute(rule, [args] as any)
    if (opts?.onAuthorized && result) {
      opts.onAuthorized()
    }
    if (opts?.onUnauthorized && !result) {
      opts.onUnauthorized(opts.message || 'Unauthorized', opts.statusCode || 401)
    }

    return result
  }

  return Object.assign(
    ability,
    {
      options: options || {},
      get authorizer() { return true },
    },
  )
}
