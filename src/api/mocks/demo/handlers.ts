import { http, HttpResponse } from 'msw'

import type { GetOrderDetailsResponse } from '@/api/get-order-details'
import type { GetOrdersResponse } from '@/api/get-orders'
import type { RegisterRestaurantBody } from '@/api/register-restaurant'
import type { SignInBody } from '@/api/sign-in'
import type { UpdateProfileBody } from '@/api/update-profile'

import {
  findCustomer,
  findProduct,
  manager,
  orders,
  type OrderStatus,
  registeredEmails,
  restaurant,
} from './db'

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60

// Same contract as the real API: no `auth` cookie means 401 + UNAUTHORIZED, which the app
// answers by redirecting to /sign-in. Returning nothing lets the request fall through.
const protectedPaths = [
  '/me',
  '/profile',
  '/managed-restaurant',
  '/orders',
  '/orders/*',
  '/metrics/*',
]

export const authGateHandlers = protectedPaths.map((path) =>
  http.all(path, ({ cookies }) => {
    if (!cookies.auth) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Unauthorized.' },
        { status: 401 },
      )
    }
  }),
)

const statusPriority: Record<OrderStatus, number> = {
  pending: 1,
  processing: 2,
  delivering: 3,
  delivered: 4,
  canceled: 99,
}

function matches(value: string, term: string) {
  return value.toLowerCase().includes(term.toLowerCase())
}

function transition(action: string, from: OrderStatus[], to: OrderStatus) {
  return http.patch<{ orderId: string }>(
    `/orders/:orderId/${action}`,
    ({ params }) => {
      const order = orders.find((order) => order.id === params.orderId)

      if (!order || !from.includes(order.status)) {
        return new HttpResponse(null, { status: 400 })
      }

      order.status = to

      return new HttpResponse(null, { status: 204 })
    },
  )
}

export const demoHandlers = [
  http.post<never, SignInBody>('/authenticate', async ({ request }) => {
    const { email } = await request.json()

    if (!registeredEmails.has(email)) {
      return new HttpResponse(null, { status: 401 })
    }

    // The real API e-mails a magic link that sets this cookie. In the demo there is no inbox,
    // so signing in sets it right away.
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': `auth=demo-session; Path=/; Max-Age=${WEEK_IN_SECONDS}`,
      },
    })
  }),

  http.post('/sign-out', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: { 'Set-Cookie': 'auth=; Path=/; Max-Age=0' },
    })
  }),

  http.post<never, RegisterRestaurantBody>(
    '/restaurants',
    async ({ request }) => {
      const { email } = await request.json()

      registeredEmails.add(email)

      return new HttpResponse(null, { status: 201 })
    },
  ),

  http.get('/me', () => HttpResponse.json(manager)),

  http.get('/managed-restaurant', () => HttpResponse.json(restaurant)),

  http.put<never, UpdateProfileBody>('/profile', async ({ request }) => {
    const { name, description } = await request.json()

    restaurant.name = name
    restaurant.description = description ?? ''

    return new HttpResponse(null, { status: 204 })
  }),

  http.get<never, never, GetOrdersResponse>('/orders', ({ request }) => {
    const { searchParams } = new URL(request.url)

    const pageIndex = Number(searchParams.get('pageIndex') ?? 0)
    const customerName = searchParams.get('customerName')
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')

    const filtered = orders
      .map((order) => ({ order, customer: findCustomer(order.customerId) }))
      .filter(
        ({ order, customer }) =>
          (!orderId || matches(order.id, orderId)) &&
          (!status || order.status === status) &&
          (!customerName || matches(customer.name, customerName)),
      )
      .sort(
        (a, b) =>
          statusPriority[a.order.status] - statusPriority[b.order.status] ||
          b.order.createdAt.getTime() - a.order.createdAt.getTime(),
      )

    return HttpResponse.json({
      orders: filtered
        .slice(pageIndex * 10, (pageIndex + 1) * 10)
        .map(({ order, customer }) => ({
          orderId: order.id,
          createdAt: order.createdAt.toISOString(),
          status: order.status,
          customerName: customer.name,
          total: order.totalInCents,
        })),
      meta: { pageIndex, perPage: 10, totalCount: filtered.length },
    })
  }),

  http.get<{ orderId: string }, never, GetOrderDetailsResponse>(
    '/orders/:orderId',
    ({ params }) => {
      const order = orders.find((order) => order.id === params.orderId)

      if (!order) {
        return new HttpResponse(null, { status: 404 })
      }

      const { name, email, phone } = findCustomer(order.customerId)

      return HttpResponse.json({
        id: order.id,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        totalInCents: order.totalInCents,
        customer: { name, email, phone },
        orderItems: order.items.map((item) => ({
          id: item.id,
          priceInCents: item.priceInCents,
          quantity: item.quantity,
          product: { name: findProduct(item.productId).name },
        })),
      })
    },
  ),

  transition('approve', ['pending'], 'processing'),
  transition('cancel', ['pending', 'processing'], 'canceled'),
  transition('dispatch', ['processing'], 'delivering'),
  transition('deliver', ['delivering'], 'delivered'),
]
