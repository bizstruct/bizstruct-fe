import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"

type ValuePropPageProps = {
  params: Promise<{ id: string; locale: string }>
}

export default async function ValuePropPage({ params }: ValuePropPageProps) {
  const { id, locale } = await params

  if (!id || !locale) {
    notFound()
  }

  // load translations if needed in future
  await getTranslations({ locale, namespace: "HomePage" })

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <Card className="p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Value Proposition</h1>
          <p className="mt-3 text-sm text-slate-500">Placeholder page for project {id} — тут буде секція з ціннісною пропозицією.</p>
        </Card>
      </div>
    </div>
  )
}
