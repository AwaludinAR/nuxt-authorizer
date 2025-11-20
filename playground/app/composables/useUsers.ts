export default function () {
  const data = useState('USERS', () => new Map<number, User>(
    [
      [1, { id: 1, username: 'user1', role: 'admin' }],
      [2, { id: 2, username: 'user2', role: 'user', subscribed: true }],
    ],
  ))
  const current = useState<User | undefined>('CURRENT_USER', () => undefined)

  const users = computed(() => Array.from(data.value.values()))
  const addUser = (user: User) => data.value.set(user.id, user)
  const deleteUser = (id: number) => data.value.delete(id)

  return { users, current, addUser, deleteUser }
}
