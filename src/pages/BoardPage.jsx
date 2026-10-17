import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Plus, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import { filterTasks, PRIORITIES, STATUSES } from '../lib/logic'
import Board from '../components/tasks/Board'
import TaskForm from '../components/tasks/TaskForm'
import { Button, ConfirmDialog, EmptyState, inputClass, Modal, PageHeader } from '../components/ui'

export default function BoardPage() {
  const { projects, tasks, dispatch, notify } = useData()
  const [params] = useSearchParams()
  const initialProject = projects.some((p) => p.id === params.get('project')) ? params.get('project') : 'all'
  const [filters, setFilters] = useState({ q: '', status: 'all', priority: 'all', projectId: initialProject })
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  )
  const visible = useMemo(() => filterTasks(tasks, filters), [tasks, filters])
  const columns = STATUSES.filter((s) => filters.status === 'all' || s.id === filters.status)
  const setFilter = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  const onDragEnd = ({ active, over }) => {
    const column = STATUSES.find((s) => s.id === over?.id)
    const task = tasks.find((t) => t.id === active.id)
    if (column && task && task.status !== column.id) {
      dispatch({ type: 'task/move', id: task.id, status: column.id, label: column.label })
      notify(`Moved to ${column.label}`)
    }
  }

  const save = (values) => {
    const task = { ...values, title: values.title.trim() }
    if (editing.id) {
      dispatch({ type: 'task/update', task })
      notify('Task updated')
    } else {
      dispatch({ type: 'task/add', task: { ...task, id: crypto.randomUUID() } })
      notify('Task created')
    }
    setEditing(null)
  }

  const remove = () => {
    dispatch({ type: 'task/delete', id: removing.id, title: removing.title })
    notify('Task deleted')
    setRemoving(null)
    setEditing(null)
  }

  if (projects.length === 0) {
    return (
      <>
        <PageHeader title="Board" />
        <EmptyState title="Create a project first" text="Tasks belong to a project, so add one before creating tasks." action={<Link to="/projects" className="text-sm font-semibold text-teal-700 hover:underline">Go to projects</Link>} />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Board"
        subtitle="Drag cards between columns to change their status."
        action={<Button onClick={() => setEditing({ status: 'todo', projectId: filters.projectId === 'all' ? projects[0].id : filters.projectId })}><Plus size={16} /> New task</Button>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-2.5 text-stone-400" />
          <input aria-label="Search tasks" placeholder="Search tasks" value={filters.q} onChange={setFilter('q')} className={`${inputClass} pl-9`} />
        </div>
        <select aria-label="Filter by project" value={filters.projectId} onChange={setFilter('projectId')} className={inputClass}>
          <option value="all">All projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Filter by status" value={filters.status} onChange={setFilter('status')} className={inputClass}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select aria-label="Filter by priority" value={filters.priority} onChange={setFilter('priority')} className={`${inputClass} capitalize`}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" text="Create your first task to start filling the board." action={<Button onClick={() => setEditing({ status: 'todo' })}>New task</Button>} />
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <Board columns={columns} tasks={visible} projects={projects} onOpen={setEditing} onAdd={(status) => setEditing({ status })} />
        </DndContext>
      )}

      {editing && !removing && (
        <Modal title={editing.id ? 'Task details' : 'New task'} onClose={() => setEditing(null)}>
          <TaskForm task={editing} projects={projects} onSubmit={save} onCancel={() => setEditing(null)} onDelete={editing.id ? () => setRemoving(editing) : undefined} />
        </Modal>
      )}
      {removing && (
        <ConfirmDialog title="Delete task?" message={`“${removing.title}” will be permanently deleted.`} onConfirm={remove} onCancel={() => setRemoving(null)} />
      )}
    </>
  )
}
