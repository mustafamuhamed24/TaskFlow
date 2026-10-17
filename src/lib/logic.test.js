import { describe, expect, it } from 'vitest'
import { filterTasks, taskStats, upcomingDeadlines } from './logic'
import { reducer } from './reducer'

const tasks = [
  { id: '1', title: 'Design login', description: '', status: 'todo', priority: 'high', projectId: 'a', dueDate: '2026-01-05' },
  { id: '2', title: 'Write docs', description: 'readme', status: 'done', priority: 'low', projectId: 'b', dueDate: '2026-01-01' },
  { id: '3', title: 'Fix bug', description: '', status: 'in_progress', priority: 'high', projectId: 'a', dueDate: '' },
]

describe('filterTasks', () => {
  it('combines status, priority, project and text filters', () => {
    expect(filterTasks(tasks, { priority: 'high', projectId: 'a' })).toHaveLength(2)
    expect(filterTasks(tasks, { q: 'README' })).toHaveLength(1)
    expect(filterTasks(tasks, { status: 'done', priority: 'high' })).toHaveLength(0)
  })
})

describe('taskStats', () => {
  it('counts statuses, overdue tasks and completion', () => {
    expect(taskStats(tasks, '2026-01-10')).toEqual({ total: 3, todo: 1, in_progress: 1, done: 1, overdue: 1, completion: 33 })
  })
  it('handles an empty list', () => {
    expect(taskStats([]).completion).toBe(0)
  })
})

describe('upcomingDeadlines', () => {
  it('skips done and undated tasks, soonest first', () => {
    expect(upcomingDeadlines(tasks).map((t) => t.id)).toEqual(['1'])
  })
})

describe('reducer', () => {
  const state = { projects: [{ id: 'a', name: 'A' }], tasks, activity: [], settings: {} }
  it('deletes a project together with its tasks', () => {
    const next = reducer(state, { type: 'project/delete', id: 'a', name: 'A' })
    expect(next.projects).toHaveLength(0)
    expect(next.tasks.map((t) => t.id)).toEqual(['2'])
    expect(next.activity).toHaveLength(1)
  })
  it('moves a task and ignores no-op moves', () => {
    expect(reducer(state, { type: 'task/move', id: '1', status: 'done', label: 'Done' }).tasks[0].status).toBe('done')
    expect(reducer(state, { type: 'task/move', id: '1', status: 'todo', label: 'To Do' })).toBe(state)
  })
})
