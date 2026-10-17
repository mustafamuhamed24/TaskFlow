import { Field, Form, Formik } from 'formik'
import { Trash2 } from 'lucide-react'
import { ASSIGNEES, PRIORITIES, STATUSES } from '../../lib/logic'
import { taskSchema } from '../../lib/schemas'
import { Button, FormRow, inputClass } from '../ui'

export default function TaskForm({ task, projects, onSubmit, onDelete, onCancel }) {
  const initial = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignee: ASSIGNEES[0],
    projectId: projects[0]?.id ?? '',
    dueDate: '',
    ...task,
  }

  return (
    <Formik initialValues={initial} validationSchema={taskSchema} onSubmit={onSubmit}>
      {({ errors, touched }) => (
        <Form className="space-y-4" noValidate>
          <FormRow label="Title" error={touched.title && errors.title}>
            <Field name="title" className={inputClass} autoFocus />
          </FormRow>
          <FormRow label="Description" error={touched.description && errors.description}>
            <Field as="textarea" rows={3} name="description" className={inputClass} />
          </FormRow>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow label="Project" error={touched.projectId && errors.projectId}>
              <Field as="select" name="projectId" className={inputClass}>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Field>
            </FormRow>
            <FormRow label="Status">
              <Field as="select" name="status" className={inputClass}>
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </Field>
            </FormRow>
            <FormRow label="Priority">
              <Field as="select" name="priority" className={`${inputClass} capitalize`}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </Field>
            </FormRow>
            <FormRow label="Assignee" error={touched.assignee && errors.assignee}>
              <Field as="select" name="assignee" className={inputClass}>
                {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
              </Field>
            </FormRow>
            <FormRow label="Due date">
              <Field type="date" name="dueDate" className={inputClass} />
            </FormRow>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            {onDelete ? (
              <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
                <Trash2 size={16} /> Delete
              </Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Save task</Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
