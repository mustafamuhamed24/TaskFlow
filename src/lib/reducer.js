const log = (state, text) => ({
  ...state,
  activity: [{ id: crypto.randomUUID(), text, at: new Date().toISOString() }, ...state.activity].slice(0, 20),
})

export function reducer(state, action) {
  switch (action.type) {
    case 'project/add':
      return log({ ...state, projects: [...state.projects, action.project] }, `Created project “${action.project.name}”`)
    case 'project/update':
      return log(
        { ...state, projects: state.projects.map((p) => (p.id === action.project.id ? { ...p, ...action.project } : p)) },
        `Updated project “${action.project.name}”`,
      )
    case 'project/delete':
      return log(
        {
          ...state,
          projects: state.projects.filter((p) => p.id !== action.id),
          tasks: state.tasks.filter((t) => t.projectId !== action.id),
        },
        `Deleted project “${action.name}”`,
      )
    case 'task/add':
      return log({ ...state, tasks: [...state.tasks, action.task] }, `Created task “${action.task.title}”`)
    case 'task/update':
      return log(
        { ...state, tasks: state.tasks.map((t) => (t.id === action.task.id ? { ...t, ...action.task } : t)) },
        `Updated task “${action.task.title}”`,
      )
    case 'task/move': {
      const task = state.tasks.find((t) => t.id === action.id)
      if (!task || task.status === action.status) return state
      return log(
        { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t)) },
        `Moved “${task.title}” to ${action.label}`,
      )
    }
    case 'task/delete':
      return log({ ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }, `Deleted task “${action.title}”`)
    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.settings } }
    case 'reset':
      return action.seed
    default:
      return state
  }
}
