import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, FolderKanban, KanbanSquare, LayoutDashboard, Menu, Settings, X } from 'lucide-react'
import clsx from 'clsx'
import { format, parseISO } from 'date-fns'
import { useData } from '../../context/DataContext'
import { attentionTasks, isOverdue } from '../../lib/logic'
import { Badge } from '../ui'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/board', label: 'Board', icon: KanbanSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2 px-3 text-lg font-bold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-teal-700 text-sm text-white">T</span>
        TaskFlow
      </Link>
      <nav className="space-y-1" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-teal-50 text-teal-800' : 'text-stone-600 hover:bg-stone-100',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function AppShell() {
  const { tasks, settings } = useData()
  const { pathname } = useLocation()
  const [drawer, setDrawer] = useState(false)
  const [bell, setBell] = useState(false)
  const alerts = useMemo(() => attentionTasks(tasks), [tasks])
  const name = settings.name || 'You'
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    setDrawer(false)
    setBell(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawer(false)
        setBell(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-stone-900/40" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <button aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute right-3 top-4 rounded-md p-1 text-stone-500 hover:bg-stone-100">
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open menu" onClick={() => setDrawer(true)} className="rounded-md p-2 text-stone-600 hover:bg-stone-100 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button aria-label="Notifications" aria-expanded={bell} onClick={() => setBell((v) => !v)} className="relative rounded-md p-2 text-stone-600 hover:bg-stone-100">
                <Bell size={20} />
                {alerts.length > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />}
              </button>
              {bell && (
                <>
                  <button aria-label="Close notifications" className="fixed inset-0 z-10 cursor-default" onClick={() => setBell(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-white p-2 shadow-lg ring-1 ring-stone-200">
                    <p className="px-3 py-2 text-sm font-semibold">Needs attention</p>
                    {alerts.length === 0 ? (
                      <p className="px-3 pb-3 text-sm text-stone-500">Nothing is overdue or due in the next two days.</p>
                    ) : (
                      <ul>
                        {alerts.map((t) => (
                          <li key={t.id}>
                            <Link to="/board" className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-stone-50">
                              <span className="truncate">{t.title}</span>
                              {isOverdue(t.dueDate) ? <Badge tone="overdue">Overdue</Badge> : <span className="shrink-0 text-xs text-stone-500">{format(parseISO(t.dueDate), 'MMM d')}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
            <Link to="/settings" className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-stone-100">
              <span className="grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{initials}</span>
              <span className="hidden text-sm font-medium sm:block">{name}</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
