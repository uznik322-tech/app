import { useEffect, useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { useApp, trackEvent } from '@/lib/i18n'
import type { DictKey } from '@/lib/i18n'

export type LeadKind = 'free' | 'sell' | 'coop' | 'similar'

const TITLES: Record<LeadKind, DictKey> = {
  free: 'form_free',
  sell: 'form_sell',
  coop: 'form_coop',
  similar: 'pick_similar',
}

export default function LeadModal({
  kind, context, onClose,
}: {
  kind: LeadKind
  context?: string
  onClose: () => void
}) {
  const { t } = useApp()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) { setErr(true); return }
    // CRM hand-off point: POST to Twenty CRM API with name/contact/context/UTM/source/timestamp.
    // Payload assembled here so the integration module can send it unchanged.
    const payload = {
      name, contact, message: msg, kind, context,
      url: window.location.href,
      utm: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
      ts: new Date().toISOString(),
    }
    trackEvent('lead_submitted', payload)
    setSent(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0e2b46]/60 backdrop-blur-[4px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" aria-modal="true" aria-label={t(TITLES[kind])}
    >
      <div className="bg-[#F8F7F4] w-full max-w-[480px] p-8 relative shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-2 text-[#0e2b46]/60 hover:text-[#0e2b46] cursor-pointer">
          <X size={20} />
        </button>

        {sent ? (
          <div className="text-center py-8">
            <CheckCircle2 size={52} className="mx-auto text-[#cea84e]" />
            <h3 className="font-display text-[30px] mt-4">{t('form_ok_t')}</h3>
            <p className="mt-2 text-[#3A4A57]/80">{t('form_ok_d')}</p>
            <button onClick={onClose} className="btn-gold mt-6">OK</button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-[30px]">{t(TITLES[kind])}</h3>
            {context && <p className="mt-1 text-[13px] text-[#3A4A57]/70">{context}</p>}
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <input
                value={name} onChange={(e) => setName(e.target.value)} placeholder={t('form_name')}
                className="w-full bg-white border border-[#0e2b46]/15 px-4 py-3 text-[15px] outline-none focus:border-[#cea84e] transition-colors"
                aria-label={t('form_name')} autoFocus
              />
              <input
                value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t('form_contact')}
                className="w-full bg-white border border-[#0e2b46]/15 px-4 py-3 text-[15px] outline-none focus:border-[#cea84e] transition-colors"
                aria-label={t('form_contact')}
              />
              <textarea
                value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t('form_msg')} rows={3}
                className="w-full bg-white border border-[#0e2b46]/15 px-4 py-3 text-[15px] outline-none focus:border-[#cea84e] transition-colors resize-none"
                aria-label={t('form_msg')}
              />
              {err && <p className="text-[13px] text-red-700">{t('form_err')}</p>}
              <button type="submit" className="btn-gold w-full justify-center">{t('form_send')}</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
