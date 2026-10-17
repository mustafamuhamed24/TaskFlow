import { useDraggable, useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { format, parseISO } from 'date-fns'
import { CalendarDays, Plus } from 'lucide-react'
import { isOverdue } from '../../lib/logic'
import { Badge } from '../ui'

function TaskCard({ task, projectName, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const overdue = task.status !== 'done' && isOverdue(task.dueDate)
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(task)}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className={clsx(
        'cursor-grab rounded-lg bg-white p-3 text-left shadow-sm ring-1 ring-stone-200 transition-shadow hover:ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600',
        isDragging && 'relative z-10 cursor-grabbing opacity-80 shadow-lg',
      )}
    >
      <p className="text-sm font-semibold">{task.title}</p>
      <p className="mt-0.5 truncate text-xs text-stone-500">{projectName}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={task.priority}>{task.priority}</Badge>
        {task.dueDate && (
          <span className={clsx('inline-flex items-center gap-1 text-xs', overdue ? 'font-semibold text-red-600' : 'text-stone-500')}>
            <CalendarDays size={12} /> {format(parseISO(task.dueDate), 'MMM d')}
          </span>
        )}
        <span className="ml-auto text-xs text-stone-500">{task.assignee.split(' ')[0]}</span>
      </div>
    </div>
  )
}

function Column({ status, tasks, projectNames, onOpen, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id })
  return (
    <section
      ref={setNodeRef}
      aria-label={status.label}
      className={clsx('flex min-h-48 flex-col rounded-xl p-3 ring-1 transition', isOver ? 'bg-teal-50 ring-teal-300' : 'bg-stone-100/70 ring-stone-200')}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {status.label} <span className="ml-1 font-normal text-stone-500">{tasks.length}</span>
        </h2>
        <button aria-label={`Add task to ${status.label}`} onClick={() => onAdd(status.id)} className="rounded-md p-1 text-stone-500 hover:bg-stone-200">
          <Plus size={16} />
        </button>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {tasks.length === 0 && <p className="py-6 text-center text-xs text-stone-500">Drop a task here or add one.</p>}
        {tasks.map((t) => <TaskCard key={t.id} task={t} projectName={projectNames[t.projectId]} onOpen={onOpen} />)}
      </div>
    </section>
  )
}

export default function Board({ columns, tasks, projects, onOpen, onAdd }) {
  const projectNames = Object.fromEntries(projects.map((p) => [p.id, p.name]))
  return (
    <div className={clsx('grid gap-4', columns.length > 1 && 'md:grid-cols-3')}>
      {columns.map((s) => (
        <Column key={s.id} status={s} tasks={tasks.filter((t) => t.status === s.id)} projectNames={projectNames} onOpen={onOpen} onAdd={onAdd} />
      ))}
    </div>
  )
}
