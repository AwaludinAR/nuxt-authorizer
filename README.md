# Nuxt Authorizer

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![pkg.pr.new](https://pkg.pr.new/badge/AwaludinAR/nuxt-authorizer)](https://pkg.pr.new/~/AwaludinAR/nuxt-authorizer)

A lightweight and flexible authorization module for Nuxt App.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/awaludinar/nuxt-authorizer?file=playground%2Fapp.vue)

## Features

- [x] &nbsp;**Declarative abilities** - Define permission rules using a clean, composable API.
- [x] &nbsp;**Full-stack authorization** - Works in both client and server through unified utilities.
- [x] &nbsp;**Component-level access control** - `<Can>` and `<Cannot>` components included.
- [x] &nbsp;**Type-safe rules** — Strong TypeScript support for better DX.
- [x] &nbsp;**Nested and array-based abilities** - Model complex permission logic easily.
- [x] &nbsp;**Customizable callbacks & error handling** - Override messages, status codes, and execution logic.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-authorizer
```

That's it! You can now use Nuxt Authorizer in your Nuxt app ✨

## Documentation

### Quick Start

#### Define ability

```ts
const editPost = defineAbility((user: User, post: Post) => user.id === post.authorId)
```

#### Usage (Client or Server)
```ts
const allowed = await allows(editPost, user, post)
const denied = await denies(editPost, user, post)
```

#### Usage with component
```vue
<template>
  <div>
    <Can :ability="editPost" :args="[user, post]">
      <p>Authorized</>
    </Can>
    <Cannot :ability="editPost" :args=[user, post]>
      <p>Unauthorized</>
    </Cannot>
  </div>
</template>
```

#### Usage with composables
```vue
<script lang="ts" setup>
const { authorized, execute } = useAbility(editPost)
</script>

<template>
  <div>
    <button @click="execute(user, post)">Edit</button>
    <div v-if="authorized">
      Authorized
    </div>
  </div>
</template>
```

#### Throw error if Unauthorized (Server)

```ts

await authorize(editPost, user, post)

```

### Ability

Transform any function that has a boolean return, rule, or array rules into an ability.

#### Nested Ability

##### define ability

> [!NOTE]
> You can define abilities wherever you want, but if static is recommended in the `/shared/utils` folder (Nuxt v4).

```ts

const ability = defineAbility((user: User) => {
  post: (post: Post) => ({
    edit: () => user.id === post.authorId,
    delete: () => user.role === 'admin' || user.id === post.authorId
  }),
  comment: () => ({
    create: () => !!user,
    edit: (comment: Comment) => user.id === comment.authorId
  })
})

```

##### Usage

```ts
// Server or Client
const allowed = await allows(ability, user, 'post', 'edit')
const denied = await denies(ability, user, 'post', 'edit')

// Server
await authorize(ability, user, 'post', 'edit')

// Composables
const {authorized, execute} = useAbility(ability)
execute(user, 'post', 'edit')
```

##### Usage with component

```vue
<template>
  <div>
    <Can :ability="ability" :args="[user, 'post', 'edit']">
      <div> Authorized </>
    </Can>
    <Cannot :ability="ability" :args="[user, 'post', 'edit']">
      <div> Authorized </>
    </Cannot>
  </div>
</template>
```

#### Array Abilities

Unlike nested abilities, Array abilities evaluate all rules. If any rule returns false, the result is false.

```ts

// define ability/rule
const editPost = defineAbility((user: User, post: Post) => user.id === post.authorId)
const arrayAbilities = defineAbility([
  editPost,
  () => true,
  async(user: User, post: Post) => Promise.resolve(user.id === post.authorId)
] as const /* for better type */)

// usage
const passed = await allows(arrayAbilities, [user, post /* ARGS_RULE_1 */], [/* ARGS_RULE_2 */], [/* ARGS_RULE_3 */])

// Composables
const {authorized, execute} = useAbility(arrayAbilities)
execute([user, post /* ARGS_RULE_1 */], [/* ARGS_RULE_2 */], [/* ARGS_RULE_3 */])
```

##### Use with component

```vue
<template>
  <div>
    <Can :ability="arrayAbilities" :args="[]">
  </div>
</template>
```

#### Nested Array Abilities

```ts
const canAccess = defineAbility([
  (user: User) => [
    async() => await isVerified(user.id),
    (role: string) => user.role === role, 
  ]
])
```

#### Dynamic rule
```ts
const rule = await getRuleByUser(userId)

const ability = defineAbility(rule)

// Usage
const allowed = await ability(/* PARAMETERS /*)
```

or you can use `useAbility`, composables accept functions (rules) or abilities

### Components

`Can` Component will make content inside `<slot/>` visible if authorized is `true`.

#### Can Component

```vue
<template>
  <Can ability="..." args="[...]">
    <div>Visible if authorized true</div>
  </Can>
</template>
```

#### Cannot Component

`Cannot` Component will make content inside `<slot/>` visible if authorized is `false`.

```vue
<template>
  <Cannot ability="..." args="[...]">
    <div>Visible if authorized false</div>
  </Cannot>
</template>
```

#### Authorizer Component

with `Authorizer` Component lets you control both `Can` and `Cannot` components, and includes `onAuthorized` and `onUnauthorized` callbacks.

```vue
<template>
  <Authorizer ability="..." args"[...]" onAuthorized="..." onUnauthorized="...">
    <template #can>
      <div>Visible if Authorized is true</div>
    </template>

    <template #cannot>
      <div>Visible if Unauthorized is false</div>
    </template>
  </Authorizer>
</template>
```

### Options

#### Set Callback in ability

```ts
const ability = defineAbility(() => true, {
  onAuthorized: () => {
    // Your implementations
  },
  onUnauthorized: (message, statusCode) => {
    // Your implementations
  }
})
```

#### Custom error status code and message

```ts
const ability = defineAbility(() => true, {
  statusCode: 401,
  message: 'Unauthorized'
})
```

#### Set Callback in composables

```vue
<script lang="ts" setup>

const { authorized } = useAbility(ability, {
  onAuthorized: () => {
    // Your implementations
  },
  onUnauthorized: (message, statusCode) => {
    // Your implementations
  }
})

</script>
```

#### Custom executor

```ts
const ability = defineAbility(() => true, {
  executor: (rule, args) => {
    return true
  }
})
```


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-authorizer/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-authorizer

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-authorizer.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-authorizer

[license-src]: https://img.shields.io/npm/l/nuxt-authorizer.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-authorizer

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
