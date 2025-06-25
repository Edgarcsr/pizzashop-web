import { api } from '@/lib/axios'

export interface GetDayOrdersAmounteResponse {
  amount: number
  diffFromYesterday: number
}

export async function getDayOrdersAmount() {
  const response = await api.get<GetDayOrdersAmounteResponse>(
    'metrics/day-orders-amount',
  )
  return response.data
}
