export const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]
export const PRIORITIES = ['low', 'medium', 'high']
export const ASSIGNEES = ['Alex Morgan', 'Sam Rivera', 'Jo Chen', 'Priya Patel']

export const statusLabel = (id) => STATUSES.find((s) => s.id === id)?.label ?? id
const localDate = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD in the user's timezone
}
export const today = () => localDate()
export const isOverdue = (dueDate, now = today()) => Boolean(dueDate) && dueDate < now

export function filterTasks(tasks, { q = '', status = 'all', priority = 'all', projectId = 'all' } = {}) {
  const needle = q.trim().toLowerCase()
  return tasks.filter(
    (t) =>
      (status === 'all' || t.status === status) &&
      (priority === 'all' || t.priority === priority) &&
      (projectId === 'all' || t.projectId === projectId) &&
      (!needle || `${t.title} ${t.description}`.toLowerCase().includes(needle)),
  )
}

export function taskStats(tasks, now = today()) {
  const count = (status) => tasks.filter((t) => t.status === status).length
  const total = tasks.length
  const done = count('done')
  return {
    total,
    todo: count('todo'),
    in_progress: count('in_progress'),
    done,
    overdue: tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate, now)).length,
    completion: total ? Math.round((done / total) * 100) : 0,
  }
}

export function upcomingDeadlines(tasks, limit = 5) {
  return tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit)
}

export function attentionTasks(tasks, days = 2) {
  const limit = localDate(days)
  return tasks
    .filter((t) => t.dueDate && t.status !== 'done' && t.dueDate <= limit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}
