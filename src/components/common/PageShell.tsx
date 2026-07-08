type PageShellProps = {
  title: string
  description: string
  children?: React.ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      {children ? <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div> : null}
    </section>
  )
}
