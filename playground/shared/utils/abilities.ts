export const createUser = defineAbility((user: User) => user.role === 'admin')

export const basePermissions = defineAbility((user?: User) => ({
  profile: () => !!user,
}))
