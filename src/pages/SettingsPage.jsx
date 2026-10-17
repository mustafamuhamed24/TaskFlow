import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useData } from '../context/DataContext'
import { buildSeed } from '../data/seed'
import { Button, ConfirmDialog, FormRow, inputClass, PageHeader } from '../components/ui'

const schema = Yup.object({ name: Yup.string().trim().min(2, 'Use at least 2 characters').max(40, 'Keep it under 40 characters').required('Enter your name') })

export default function SettingsPage() {
  const { settings, dispatch, notify } = useData()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile and local data." />
      <div className="max-w-xl space-y-6">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <h2 className="mb-4 text-sm font-semibold">Profile</h2>
          <Formik
            initialValues={{ name: settings.name ?? '' }}
            validationSchema={schema}
            onSubmit={(v) => {
              dispatch({ type: 'settings', settings: { name: v.name.trim() } })
              notify('Profile saved')
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4" noValidate>
                <FormRow label="Display name" error={touched.name && errors.name}>
                  <Field name="name" className={inputClass} />
                </FormRow>
                <Button type="submit">Save profile</Button>
              </Form>
            )}
          </Formik>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-sm font-semibold">Demo data</h2>
          <p className="mb-4 mt-1 text-sm text-stone-500">Data is stored in this browser only. Resetting replaces everything with the sample projects and tasks.</p>
          <Button variant="danger" onClick={() => setConfirming(true)}>Reset to demo data</Button>
        </section>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Reset all data?"
          message="Your projects, tasks and activity will be replaced with the demo data. This can't be undone."
          confirmLabel="Reset data"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            dispatch({ type: 'reset', seed: buildSeed() })
            notify('Demo data restored')
            setConfirming(false)
          }}
        />
      )}
    </>
  )
}
