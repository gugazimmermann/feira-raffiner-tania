import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export type LeadData = {
  nome: string
  empresa: string
  whatsapp: string
}

type FieldErrors = Partial<Record<keyof LeadData, string>>

type LeadFormProps = {
  onSuccess: (data: LeadData) => void
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function formatWhatsapp(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : ''
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function validate(data: LeadData): FieldErrors {
  const errors: FieldErrors = {}

  if (data.nome.trim().length < 2) {
    errors.nome = 'Informe seu nome completo.'
  }

  if (data.empresa.trim().length < 2) {
    errors.empresa = 'Informe o nome da empresa.'
  }

  const digits = onlyDigits(data.whatsapp)
  if (digits.length < 10 || digits.length > 11) {
    errors.whatsapp = 'Informe um WhatsApp válido com DDD.'
  }

  return errors
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const [form, setForm] = useState<LeadData>({
    nome: '',
    empresa: '',
    whatsapp: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function updateField<K extends keyof LeadData>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setSubmitError(null)
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload: LeadData = {
      nome: form.nome.trim(),
      empresa: form.empresa.trim(),
      whatsapp: form.whatsapp.trim(),
    }

    setSubmitting(true)

    const { error } = await supabase.from('leads').insert(payload)

    setSubmitting(false)

    if (error) {
      setSubmitError('Não foi possível enviar seus dados. Tente novamente.')
      return
    }

    onSuccess(payload)
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          name="nome"
          type="text"
          placeholder="Seu nome"
          value={form.nome}
          onChange={(event) => updateField('nome', event.target.value)}
          aria-invalid={Boolean(errors.nome)}
          aria-describedby={errors.nome ? 'nome-error' : undefined}
        />
        {errors.nome ? (
          <p id="nome-error" className="field__error" role="alert">
            {errors.nome}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="empresa">Empresa</label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          placeholder="Nome da empresa"
          value={form.empresa}
          onChange={(event) => updateField('empresa', event.target.value)}
          aria-invalid={Boolean(errors.empresa)}
          aria-describedby={errors.empresa ? 'empresa-error' : undefined}
        />
        {errors.empresa ? (
          <p id="empresa-error" className="field__error" role="alert">
            {errors.empresa}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="numeric"
          placeholder="(11) 99999-9999"
          value={form.whatsapp}
          onChange={(event) =>
            updateField('whatsapp', formatWhatsapp(event.target.value))
          }
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
        />
        {errors.whatsapp ? (
          <p id="whatsapp-error" className="field__error" role="alert">
            {errors.whatsapp}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="field__error" role="alert">
          {submitError}
        </p>
      ) : null}

      <button className="submit-btn" type="submit" disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar'}
      </button>
    </form>
  )
}
