import { Utensils } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// export interface MonthOrdersAmountProps {}

export function MonthOrdersAmountCard(/* props: MonthOrdersAmountProps */) {
  return (
    <Card className="flex gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (mês)</CardTitle>
        <Utensils className="text-muted-foreground !h-4 !w-4" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold tracking-tight">246</span>
        <p className="text-muted-foreground mt-1 text-xs">
          <span className="text-emerald-500 dark:text-emerald-400">+6%</span> em
          relação ao mês passado
        </p>
      </CardContent>
    </Card>
  )
}
