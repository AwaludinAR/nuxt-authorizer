<script setup lang="ts">
const { posts } = usePosts()
const { current } = useUsers()
</script>

<template>
  <section>
    <h1>Posts</h1>

    <hr>
    <ul class="base">
      <li v-for="post in posts" :key="post.id">
        <div>
          <NuxtLink :to="`/post-${post.id}`" replace>{{ post.title }}</NuxtLink>
          <Can :ability="(post: Post, user?: User) => !!user && post.authorId === user.id" :args="[post, current]" as="span">
            (Your post)
          </Can>
        </div>
      </li>
    </ul>
    <hr>
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
