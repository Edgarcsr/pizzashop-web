import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  { date: '18/06', revenue: 1000 },
  { date: '19/06', revenue: 1400 },
  { date: '20/06', revenue: 880 },
  { date: '21/06', revenue: 1200 },
  { date: '22/06', revenue: 900 },
  { date: '23/06', revenue: 1900 },
  { date: '24/06', revenue: 640 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-6">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} style={{ fontSize: 12 }}>
            <XAxis
              dataKey={'date'}
              tickLine={false}
              axisLine={false}
              dy={16}
              style={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#888"
              axisLine={false}
              tickLine={false}
              dx={-6}
              tickFormatter={(value: number) =>
                value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }
              width={80}
            />
            <CartesianGrid vertical={false} className="stroke-muted" />
            <Line
              type={'linear'}
              strokeWidth={2}
              dataKey="revenue"
              stroke={colors.rose['500']}
            />
            {/* <Tooltip /> */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
