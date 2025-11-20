<script lang="ts" setup>
const { current, users } = useUsers()
const navigations = [
  { label: 'Home', to: '/' },
  { label: 'Posts', to: '/posts' },
]
</script>

<template>
  <header>
    Login as
    <select v-model="current">
      <option value="" disabled>
        Select one
      </option>
      <option v-for="user in users" :key="user.id" :value="user">
        {{ `[${user.id}] - ${user.username}` }}
      </option>
    </select>

    <div style="display: flex; gap: 1.5rem;">
      <NuxtLink v-for="navigation in navigations" :key="navigation.to" :to="navigation.to" replace>
        {{ navigation.label }}
      </NuxtLink>

      <Can :ability="basePermissions" :args="[current, 'profile']">
        <NuxtLink to="/post" replace>Create Post</NuxtLink>
      </Can>
    </div>
  </header>
  <main style="margin-top: 1rem;">
    <slot />
  </main>
</template>
