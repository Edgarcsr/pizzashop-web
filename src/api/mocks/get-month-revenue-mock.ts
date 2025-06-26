import { http, HttpResponse } from 'msw'

import type { GetMonthRevenueResponse } from '../get-month-revenue'

export const getMonthRevenueAmountMock = http.get<
  never,
  never,
  GetMonthRevenueResponse
>('/metrics/month-receipt', () => {
  return HttpResponse.json({
    receipt: 16000,
    diffFromLastMonth: 10,
  })
})
