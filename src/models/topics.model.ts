export interface Topic {
  name: string
  id: string
  slug: string
  posts: number
  type: 'tag' | 'category'
}
