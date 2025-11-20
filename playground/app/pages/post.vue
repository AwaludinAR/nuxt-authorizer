<script setup lang="ts">
const { addPost, posts } = usePosts()
const { current } = useUsers()

const nextPostId = computed(() => posts.value.length + 1)
const title = ref('')
const content = ref('')
const premium = ref(false)
</script>

<template>
  <section>
    <h1>Create Post</h1>
    <hr>

    <Authorizer :ability="basePermissions" :args="[current, 'profile']" as="div" class="base">
      <template #can>
        <div>
          Title
          <input v-model="title" placeholder="Enter post title">
        </div>
        <div>
          Content
          <div>
            <!-- eslint-disable-next-line -->
            <textarea v-model="content" placeholder="Enter post content"></textarea>
          </div>
        </div>
        <div>
          <input v-model="premium" type="checkbox">
          Premium content
        </div>
        <div>
          <button
            @click="() => {
              addPost({ id: nextPostId, title, authorId: current!.id, content, premium })
              $router.replace('/posts')
            }"
          >
            Add post
          </button>
        </div>
      </template>

      <template #cannot>
        Please login for create post
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
