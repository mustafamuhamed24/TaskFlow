import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { useData } from '../context/DataContext'
import { isOverdue, statusLabel, taskStats, upcomingDeadlines } from '../lib/logic'
import { Badge, EmptyState, PageHeader } from '../components/ui'

const Panel = ({ title, children }) => (
  <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
    <h2 className="mb-4 text-sm font-semibold">{title}</h2>
    {children}
  </section>
)

export default function DashboardPage() {
  const { projects, tasks, activity, settings } = useData()
  const stats = useMemo(() => taskStats(tasks), [tasks])
  const deadlines = useMemo(() => upcomingDeadlines(tasks), [tasks])
  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? 'Unknown project'

  if (projects.length === 0 && tasks.length === 0) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <EmptyState title="Nothing to summarise yet" text="Create a project and add tasks to see progress, deadlines and activity here." action={<Link to="/projects" className="text-sm font-semibold text-teal-700 hover:underline">Create a project</Link>} />
      </>
    )
  }

  const cards = [
    { label: 'Total tasks', value: stats.total },
    { label: 'In progress', value: stats.in_progress },
    { label: 'Completed', value: `${stats.completion}%` },
    { label: 'Overdue', value: stats.overdue, alert: stats.overdue > 0 },
  ]

  return (
    <>
      <PageHeader title={`Welcome back, ${(settings.name || 'there').split(' ')[0]}`} subtitle="Here is where your work stands today." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <p className="text-sm text-stone-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.alert ? 'text-red-600' : ''}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Projects">
          {projects.length === 0 ? (
            <p className="text-sm text-stone-500">No projects yet.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((p) => {
                const own = tasks.filter((t) => t.projectId === p.id)
                const pct = own.length ? Math.round((own.filter((t) => t.status === 'done').length / own.length) * 100) : 0
                return (
                  <li key={p.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <Link to={`/board?project=${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                      <span className="text-stone-500">{own.length} tasks · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-100">
                      <div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Upcoming deadlines">
          {deadlines.length === 0 ? (
            <p className="text-sm text-stone-500">No open tasks have a due date.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {deadlines.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="truncate text-xs text-stone-500">{projectName(t.projectId)} · {statusLabel(t.status)}</p>
                  </div>
                  {isOverdue(t.dueDate) ? <Badge tone="overdue">Overdue</Badge> : <span className="shrink-0 text-stone-500">{format(parseISO(t.dueDate), 'MMM d')}</span>}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="lg:col-span-2">
          <Panel title="Recent activity">
            {activity.length === 0 ? (
              <p className="text-sm text-stone-500">Changes you make to projects and tasks will show up here.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {activity.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span>{a.text}</span>
                    <span className="shrink-0 text-xs text-stone-500">{formatDistanceToNow(parseISO(a.at), { addSuffix: true })}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
