export interface Params {
  params: Promise<{
    id?: string
    name?: string
    type?: string
    slug?: string
    userId?: string
  }>
}
