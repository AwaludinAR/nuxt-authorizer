<script setup lang="ts">
const { current, users, addUser } = useUsers()

const nextUserId = computed(() => users.value.length + 1)
const form = reactive<User>({
  id: nextUserId.value,
  username: '',
  role: 'user',
  subscribed: false,
})

const submit = () => {
  addUser({ ...form, id: nextUserId.value })
  form.username = ''
}
</script>

<template>
  <section>
    <h1>Home</h1>
    <div class="base">
      <div>
        <div style="font-size: 1.25rem; font-weight: 600;">
          Profile
        </div>
        <hr>
        <Authorizer :ability="basePermissions" :args="[current, 'profile']">
          <template #can>
            <div>{{ current }}</div>
          </template>

          <template #cannot>
            <div>Please login</div>
          </template>
        </Authorizer>
        <hr>
      </div>

      <Can v-if="current" :ability="createUser" :args="[current]">
        <div style="font-size: 1.25rem; font-weight: 600;">
          Create user
        </div>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            Username
            <input v-model="form.username" placeholder="Enter username">
          </div>
          <div>
            Role
            <select v-model="form.role">
              <option value="" disabled>
                Select role
              </option>
              <option value="user">
                User
              </option>
              <option value="admin">
                Admin
              </option>
            </select>
          </div>
          <div v-if="form.role === 'user'">
            <input v-model="form.subscribed" type="checkbox">
            Subscribed
          </div>
          <div>
            <button @click="submit">
              Create
            </button>
          </div>
        </div>
      </Can>
    </div>
  </section>
</template>

<style lang="css" scoped>
.base {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 1.5rem;
}
</style>
