import { http, HttpResponse } from 'msw'

import type { GetPopularProductsResponse } from '../get-popular-products'

export const getGetPopularProductsMock = http.get<
  never,
  never,
  GetPopularProductsResponse
>('/metrics/popular-products', () => {
  return HttpResponse.json([
    { product: 'Pizza Pepperoni', amount: 1 },
    { product: 'Pizza Portuguesa', amount: 4 },
    { product: 'Pizza Mussarela', amount: 7 },
    { product: 'Pizza Calabresa', amount: 2 },
    { product: 'Pizza Aliche', amount: 6 },
  ])
})
