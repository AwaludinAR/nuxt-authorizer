<script setup lang="ts">
const route = useRoute()

const postId = computed(() => Number(route.params.id))
const { getPost, deletePost } = usePosts()
const { current } = useUsers()
const post = getPost(postId.value)
if (!post) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

const { execute: allowForPremium, authorized: allowedReadPremium } = useAbility([
  (post: Post) => !!post.premium,
  (user?: User) => !!user && (!!user.subscribed || user.role === 'admin'),
] as const)
</script>

<template>
  <section>
    <h1>{{ post.title }}</h1>
    <div>
      <Can :ability="(post: Post, user?: User) => !!user && (post.authorId === user.id || user.role === 'admin')" :args="[post, current]">
        <button
          @click="() => {
            deletePost(postId)
            $router.replace('/posts')
          }"
        >
          Delete post
        </button>
      </Can>
    </div>

    <hr>
    <Authorizer
      :ability="basePermissions" :args="[current, 'profile']" as="div" class="base"
      @on-authorized="() => allowForPremium([post], [current])"
    >
      <template #can>
        <div v-if="post.premium">
          <div v-if="allowedReadPremium">
            {{ post.content }}
          </div>
          <div v-else>
            You are not subscribed user.
          </div>
        </div>

        <div v-else>
          {{ post.content }}
        </div>
      </template>

      <template #cannot>
        <div>Please login for read content</div>
      </template>
    </Authorizer>
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
