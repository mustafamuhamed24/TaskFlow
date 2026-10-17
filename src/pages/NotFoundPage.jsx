import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      text="The page you're looking for doesn't exist or has moved."
      action={<Link to="/" className="text-sm font-semibold text-teal-700 hover:underline">Back to dashboard</Link>}
    />
  )
}
