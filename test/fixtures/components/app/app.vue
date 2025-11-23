<script setup lang="ts">
import { defineAbility } from '#imports'

const authorized = defineAbility(() => true)
const unauthorized = defineAbility(() => false)
</script>

<template>
  <div>
    <Can :ability="authorized" data-testid="can-visible">
      Can Visible
    </Can>
    <Can :ability="authorized" as="div" data-testid="as-can-visible">
      Can with as Visible
    </Can>
    <Can :ability="unauthorized" as="button" data-testid="can-invisible">
      Can invisible
    </Can>

    <Cannot :ability="unauthorized" data-testid="cannot-visible">
      Cannot Visible
    </Cannot>
    <Cannot :ability="unauthorized" as="button" data-testid="as-cannot-visible">
      Cannot with as Visible
    </Cannot>
    <Cannot :ability="authorized" as="button" data-testid="cannot-invisible">
      Cannot Invisible
    </Cannot>

    <Authorizer :ability="authorized">
      <template #can>
        <div data-testid="authorizer-can-visible">
          Can Visible from authorizer
        </div>
      </template>
      <template #cannot>
        <div data-testid="authorizer-cannot-invisible">
          Cannot invisible from authorizer
        </div>
      </template>
    </Authorizer>

    <Authorizer :ability="unauthorized">
      <template #can>
        <div data-testid="authorizer-can-invisible">
          Can Invisible from authorizer
        </div>
      </template>
      <template #cannot>
        <div data-testid="authorizer-cannot-visible">
          Cannot Visible from authorizer
        </div>
      </template>
    </Authorizer>
  </div>
</template>
