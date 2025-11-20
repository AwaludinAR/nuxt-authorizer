import { ref, toRaw, type MaybeRefOrGetter } from 'vue'
import type { Ability, AbilityOrRuleParams, OnAuthorized, OnUnauthorized, Rule } from '../../types'
import { defineAbility } from '../../utils'

type Options = {
  onAuthorized?: OnAuthorized
  onUnauthorized?: OnUnauthorized
}

export function useAbility<
  A extends Ability<any> | Rule | Rule[],
>(abilityOrRule: MaybeRefOrGetter<A>, options: Options = {}) {
  const authorized = ref(false)

  const execute = async (...args: AbilityOrRuleParams<A>) => {
    let ability = toRaw(abilityOrRule) as Ability<any>
    if (!ability?.authorizer) {
      ability = defineAbility(toRaw(abilityOrRule) as Ability<any>, options)
    }
    authorized.value = await ability(...args)

    if (authorized.value && options.onAuthorized) {
      options.onAuthorized()
    }
    if (!authorized.value && options.onUnauthorized) {
      options.onUnauthorized(
        ability.options?.message || 'Unauthorized',
        ability.options?.statusCode || 401,
      )
    }
  }

  return { authorized, execute }
}
