import { useEffect } from 'react'
import clsx from 'clsx'
import { AlertCircle, CheckCircle2, Inbox, X } from 'lucide-react'

const variants = {
  primary: 'bg-teal-700 text-white hover:bg-teal-800',
  secondary: 'bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-stone-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-stone-600 hover:bg-stone-100',
}

export function Button({ variant = 'primary', className, ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

const tones = {
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-stone-100 text-stone-600 ring-stone-200',
  active: 'bg-teal-50 text-teal-800 ring-teal-200',
  completed: 'bg-stone-100 text-stone-600 ring-stone-200',
  overdue: 'bg-red-50 text-red-700 ring-red-200',
}

export function Badge({ tone = 'low', children }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset', tones[tone])}>
      {children}
    </span>
  )
}

export const inputClass =
  'w-full rounded-lg border-0 bg-white px-3 py-2 text-sm ring-1 ring-stone-300 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600'

export function FormRow({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-stone-500 hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-stone-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <Inbox className="mb-3 text-stone-400" size={28} />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2
  return (
    <div role="status" className="fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-2 rounded-lg bg-stone-900 px-4 py-3 text-sm text-white shadow-lg">
      <Icon size={18} className={toast.type === 'error' ? 'text-red-400' : 'text-teal-400'} />
      {toast.message}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
