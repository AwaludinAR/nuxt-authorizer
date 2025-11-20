export default function () {
  const data = useState('POSTS', () => new Map<number, Post>(
    [
      [1, { id: 1, title: 'Free post 1', content: 'This content for Free post 1', authorId: 1 }],
      [2, { id: 2, title: 'Premium post 1', content: 'This content for Premium post 1', authorId: 1, premium: true }],
      [3, { id: 3, title: 'Free post 2', content: 'This content for Free post 2', authorId: 2 }],
      [4, { id: 4, title: 'Premium post 2', content: 'This content for Premium post 1', authorId: 2, premium: true }],
    ],
  ))

  const posts = computed(() => Array.from(data.value.values()))
  const getPost = (id: number) => data.value.get(id)
  const addPost = (post: Post) => data.value.set(post.id, post)
  const deletePost = (id: number) => data.value.delete(id)

  return { posts, getPost, addPost, deletePost }
}
