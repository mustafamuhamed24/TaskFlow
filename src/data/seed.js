const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-CA')
}

export function buildSeed() {
  const projects = [
    { id: 'p1', name: 'Website redesign', description: 'New marketing site with a faster, simpler structure.', status: 'active' },
    { id: 'p2', name: 'Mobile app v2', description: 'Offline mode and push notifications.', status: 'active' },
    { id: 'p3', name: 'Onboarding docs', description: 'Guides for new customers.', status: 'completed' },
  ]
  const t = (id, title, projectId, status, priority, assignee, dueDate, description = '') => ({
    id, title, projectId, status, priority, assignee, dueDate, description,
  })
  const tasks = [
    t('t1', 'Audit current navigation', 'p1', 'done', 'medium', 'Alex Morgan', day(-6), 'List every page and cut what nobody visits.'),
    t('t2', 'Wireframe the pricing page', 'p1', 'in_progress', 'high', 'Sam Rivera', day(2), 'Three plan cards with a comparison table below.'),
    t('t3', 'Choose a CMS', 'p1', 'todo', 'medium', 'Jo Chen', day(7)),
    t('t4', 'Fix image loading on slow networks', 'p1', 'todo', 'high', 'Priya Patel', day(-1)),
    t('t5', 'Design offline sync states', 'p2', 'in_progress', 'high', 'Jo Chen', day(4), 'What the user sees while changes are queued.'),
    t('t6', 'Set up push notification service', 'p2', 'todo', 'medium', 'Alex Morgan', day(10)),
    t('t7', 'Write release notes template', 'p2', 'todo', 'low', 'Sam Rivera', ''),
    t('t8', 'Publish getting started guide', 'p3', 'done', 'low', 'Priya Patel', day(-12)),
  ]
  return { projects, tasks, activity: [], settings: { name: 'Alex Morgan' } }
}
