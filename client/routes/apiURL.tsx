export const urlId = (id: string) => (id ? `/${id}` : '')

export const apiURL = {
  signIn: () => '/login',
  signUp: () => '/sign-up',
  signOut: () => '/logout',
  apiUser: (id: string) => `/users/${urlId(id)}`,
  apiBlog: (id: string) => `/blogs/${urlId(id)}`,
}
