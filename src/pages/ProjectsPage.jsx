import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { projectSchema } from '../lib/schemas'
import { Badge, Button, ConfirmDialog, EmptyState, FormRow, inputClass, Modal, PageHeader } from '../components/ui'

function ProjectForm({ project, onSubmit, onCancel }) {
  return (
    <Formik initialValues={{ name: '', description: '', status: 'active', ...project }} validationSchema={projectSchema} onSubmit={onSubmit}>
      {({ errors, touched }) => (
        <Form className="space-y-4" noValidate>
          <FormRow label="Name" error={touched.name && errors.name}>
            <Field name="name" className={inputClass} autoFocus />
          </FormRow>
          <FormRow label="Description" error={touched.description && errors.description}>
            <Field as="textarea" rows={3} name="description" className={inputClass} />
          </FormRow>
          <FormRow label="Status">
            <Field as="select" name="status" className={inputClass}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Field>
          </FormRow>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save project</Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default function ProjectsPage() {
  const { projects, tasks, dispatch, notify } = useData()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return projects.filter((p) => (status === 'all' || p.status === status) && `${p.name} ${p.description}`.toLowerCase().includes(needle))
  }, [projects, q, status])

  const save = (values) => {
    const project = { ...values, name: values.name.trim() }
    if (editing.id) {
      dispatch({ type: 'project/update', project })
      notify('Project updated')
    } else {
      dispatch({ type: 'project/add', project: { ...project, id: crypto.randomUUID() } })
      notify('Project created')
    }
    setEditing(null)
  }

  const remove = () => {
    dispatch({ type: 'project/delete', id: removing.id, name: removing.name })
    notify('Project deleted')
    setRemoving(null)
  }

  const taskCount = (id) => tasks.filter((t) => t.projectId === id).length

  return (
    <>
      <PageHeader title="Projects" subtitle="Group related tasks and track progress." action={<Button onClick={() => setEditing({})}><Plus size={16} /> New project</Button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-2.5 text-stone-400" />
          <input aria-label="Search projects" placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputClass} pl-9`} />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" text="Projects hold your tasks. Create one to get started." action={<Button onClick={() => setEditing({})}>New project</Button>} />
      ) : visible.length === 0 ? (
        <EmptyState title="No matching projects" text="Try a different search term or clear the status filter." action={<Button variant="secondary" onClick={() => { setQ(''); setStatus('all') }}>Clear filters</Button>} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.id} className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{p.name}</h2>
                <Badge tone={p.status}>{p.status}</Badge>
              </div>
              <p className="mt-1 flex-1 text-sm text-stone-500">{p.description || 'No description.'}</p>
              <div className="mt-4 flex items-center justify-between">
                <Link to={`/board?project=${p.id}`} className="text-sm font-semibold text-teal-700 hover:underline">{taskCount(p.id)} tasks</Link>
                <div className="flex gap-1">
                  <button aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)} className="rounded-md p-2 text-stone-500 hover:bg-stone-100"><Pencil size={16} /></button>
                  <button aria-label={`Delete ${p.name}`} onClick={() => setRemoving(p)} className="rounded-md p-2 text-stone-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit project' : 'New project'} onClose={() => setEditing(null)}>
          <ProjectForm project={editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {removing && (
        <ConfirmDialog
          title="Delete project?"
          message={`“${removing.name}” and its ${taskCount(removing.id)} tasks will be permanently deleted.`}
          onConfirm={remove}
          onCancel={() => setRemoving(null)}
        />
      )}
    </>
  )
}
