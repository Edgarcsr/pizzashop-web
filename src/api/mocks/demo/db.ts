import { fakerPT_BR as faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

import type { GetOrderDetailsResponse } from '@/api/get-order-details'
import type { GetProfileResponse } from '@/api/get-profile'

export type OrderStatus = GetOrderDetailsResponse['status']

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface Order {
  id: string
  customerId: string
  status: OrderStatus
  totalInCents: number
  createdAt: Date
  items: {
    id: string
    productId: string
    priceInCents: number
    quantity: number
  }[]
}

export const DEMO_MANAGER_EMAIL = 'johndoe@example.com'

// Fixed seed: customers, products and order contents are the same on every load. Dates are
// relative to "now" and ids are real cuid2s (as in the API), so those change between loads.
faker.seed(42)

const now = new Date()

export const manager: GetProfileResponse = {
  id: createId(),
  name: faker.person.fullName(),
  email: DEMO_MANAGER_EMAIL,
  phone: faker.phone.number(),
  role: 'manager',
  createdAt: now,
  updatedAt: null,
}

export const restaurant = {
  id: createId(),
  name: 'Pizza Shop',
  description: faker.lorem.paragraph(),
  managerId: manager.id,
  createdAt: now,
  updatedAt: null as Date | null,
}

const customers: Customer[] = Array.from({ length: 12 }, () => ({
  id: createId(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
}))

const pizzaNames = [
  'Pizza Margherita',
  'Pizza Pepperoni',
  'Pizza Quatro Queijos',
  'Pizza Calabresa',
  'Pizza Portuguesa',
  'Pizza Frango com Catupiry',
  'Pizza Napolitana',
  'Pizza Vegetariana',
  'Pizza Bacon',
]

const products = pizzaNames.map((name) => ({
  id: createId(),
  name,
  priceInCents: faker.number.int({ min: 3200, max: 7900 }),
}))

const statuses: OrderStatus[] = [
  'pending',
  'canceled',
  'processing',
  'delivering',
  'delivered',
]

export const orders: Order[] = Array.from({ length: 200 }, () => {
  const id = createId()

  const items = faker.helpers
    .arrayElements(products, { min: 1, max: 3 })
    .map((product) => ({
      id: createId(),
      productId: product.id,
      priceInCents: product.priceInCents,
      quantity: faker.number.int({ min: 1, max: 3 }),
    }))

  return {
    id,
    customerId: faker.helpers.arrayElement(customers).id,
    status: faker.helpers.arrayElement(statuses),
    totalInCents: items.reduce(
      (total, item) => total + item.priceInCents * item.quantity,
      0,
    ),
    createdAt: faker.date.recent({ days: 40, refDate: now }),
    items,
  }
})

export function findCustomer(id: string) {
  return customers.find((customer) => customer.id === id)!
}

export function findProduct(id: string) {
  return products.find((product) => product.id === id)!
}

// Emails that registered through the sign-up form and may sign in during this session.
export const registeredEmails = new Set<string>([DEMO_MANAGER_EMAIL])

export function newId() {
  return createId()
}
