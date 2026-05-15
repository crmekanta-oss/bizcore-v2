import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function DataModal({ open, onClose, onSave, schema, initialData, title }) {
  const { dark } = useTheme()
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      const defaults = {}
      schema.forEach(f => { defaults[f.key] = initialData?.[f.key] ?? (f.type === 'number' ? '' : '') })
      setForm(defaults)
      setErrors({})
    }
  }, [open, initialData, schema])

  if (!open) return null

  const validate = () => {
    const e = {}
    schema.forEach(f => { if (f.required && !form[f.key]) e[f.key] = 'Required' })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const cleaned = {}
    schema.forEach(f => {
      cleaned[f.key] = f.type === 'number' ? (Number(form[f.key]) || 0) : form[f.key]
    })
    const result = await onSave(cleaned)
    setSaving(false)
    if (result !== null) {
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0B1020] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0 bg-[#0B1020]">
          <h2 className="text-2xl font-semibold text-white">
            {title}
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition text-2xl">
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {schema.map(f => (
            <div key={f.key}>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {f.type === 'select' ? (
                <select 
                  value={form[f.key] || f.options[0]} 
                  onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                  className={`w-full bg-[#0c0e14] border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors`}
                >
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input 
                  type={f.type} 
                  value={form[f.key] ?? ''} 
                  placeholder={f.placeholder}
                  onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                  className={`w-full bg-[#0c0e14] border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors`}
                />
              )}
              {errors[f.key] && <div className="text-red-500 text-xs mt-1 ml-1">{errors[f.key]}</div>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-6 py-5 border-t border-white/10 bg-[#0B1020] flex-shrink-0">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-xl border border-white/10 py-3 text-white/70 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className={`flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Add Record'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
