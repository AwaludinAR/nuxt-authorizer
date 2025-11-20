<script setup lang="ts" generic="A extends Ability<any> | Rule | Rule[]">
import { ref, watchSyncEffect, type Component } from 'vue'
import type { Ability, AbilityOrRuleParams, Rule } from '../../types'
import type { AsTag } from './Primitive'
import { Primitive } from './Primitive'
import { useAbility } from '../composables/useAbility'

const props = defineProps<{
  ability: A
  args?: AbilityOrRuleParams<A>
  as?: AsTag | Component
  asChild?: boolean
}>()
const emit = defineEmits<{
  onAuthorized: []
  onUnauthorized: [message: string, statusCode: number]
}>()

const statusCode = ref<number>()
const errMsg = ref<string>()
const { authorized, execute } = useAbility(props.ability, {
  onAuthorized: () => {
    statusCode.value = undefined
    errMsg.value = undefined
    emit('onAuthorized')
  },
  onUnauthorized: (msg, code) => {
    statusCode.value = code
    errMsg.value = msg
    emit('onUnauthorized', msg, code)
  },
})

watchSyncEffect(() => {
  const _fn = props.ability
  execute(...(props.args || []))
})
</script>

<template>
  <Primitive :as="as" :as-child="asChild">
    <slot v-if="authorized" name="can" />

    <slot v-else name="cannot" :message="errMsg" :status-code="statusCode" />
  </Primitive>
</template>
