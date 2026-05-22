import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white p-6 text-slate-900 selection:bg-indigo-100">

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">EcoSync Dashboard</h1>
          <p className="text-sm text-slate-500">Автоматизований моніторинг вуглецевого сліду та ERP потоків.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Експорт звіту</Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Синхронізувати ERP</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="rounded-xl border-slate-200 bg-white shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Статус ERP систем</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Активний</div>
            <p className="text-xs text-slate-400 mt-1">Останній бекап: 5 хв тому (SAP, Oracle)</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 bg-white shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Поточний вуглецевий слід</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240 <span className="text-sm font-normal text-slate-500">тонн CO2e</span></div>
            <p className="text-xs text-rose-500 mt-1">↑ 2.4% порівняно з минулим місяцем</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 bg-white shadow-none lg:col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Аудит-готовність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-slate-400 mt-1">Всі звіти відформатовані та валідовані</p>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}