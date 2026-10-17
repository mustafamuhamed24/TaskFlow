import * as Yup from 'yup'
import { PRIORITIES, STATUSES } from './logic'

export const projectSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Use at least 2 characters').max(60, 'Keep it under 60 characters').required('Enter a project name'),
  description: Yup.string().max(300, 'Keep it under 300 characters'),
  status: Yup.string().oneOf(['active', 'completed']).required(),
})

export const taskSchema = Yup.object({
  title: Yup.string().trim().min(2, 'Use at least 2 characters').max(100, 'Keep it under 100 characters').required('Enter a task title'),
  description: Yup.string().max(500, 'Keep it under 500 characters'),
  priority: Yup.string().oneOf(PRIORITIES).required(),
  status: Yup.string().oneOf(STATUSES.map((s) => s.id)).required(),
  assignee: Yup.string().required('Choose an assignee'),
  projectId: Yup.string().required('Choose a project'),
  dueDate: Yup.string(),
})
