import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

type ProjectPageProps = {
  params: Promise<{ id: string; locale: string }>
}

export default async function CanvasPage({ params }: ProjectPageProps) {
  const { id, locale } = await params

  if (!id || !locale) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "HomePage" })

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      <header className="h-14 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900">Project Workspace</h1>
          <p className="text-[11px] text-slate-500">Project ID: {id}</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500">
          Linear-style workspace
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">Current Project</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Project {id.slice(-6)}
              </h2>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
              ID {id}
            </span>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm min-h-[360px] flex items-center justify-center px-8 py-10">
            <div className="max-w-xl text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-semibold">
                AI
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Тут буде ваш Business Model Canvas або згенерований ШІ контент</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Поки що це робоча зона для цього проєкту. Далі тут з&apos;являться відповіді моделі, артефакти та наступні кроки.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <form className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <textarea
              rows={2}
              placeholder={t("input.placeholder")}
              className="min-h-[56px] flex-1 resize-none border-0 bg-transparent px-2 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-800"
              aria-label="Send message"
            >
              <span className="text-sm">↵</span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  )
}