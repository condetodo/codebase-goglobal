import { useState, FormEvent } from 'react'
import type {
  VendorFormProps,
  Vendor,
  VendorType,
  Language,
  Gender,
  Currency,
} from '../types'

const vendorTypes: VendorType[] = [
  'Voice Talent',
  'Editor',
  'Adaptador',
  'Editor de Sonido',
  'QA',
  'Preflight',
]

const languages: Language[] = ['Spanish LA', 'Portuguese', 'English']

const genders: Gender[] = ['Male', 'Female']

const currencies: Currency[] = ['ARS', 'USD', 'BRL']

export function VendorForm({ vendor, onSubmit, onCancel }: VendorFormProps) {
  const isEditing = !!vendor

  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>({
    voiceTalent: vendor?.voiceTalent || '',
    vtNewCode: vendor?.vtNewCode || '',
    email: vendor?.email || '',
    language: vendor?.language || 'Spanish LA',
    active: vendor?.active ?? true,
    gender: vendor?.gender || null,
    vendorType: vendor?.vendorType || 'Voice Talent',
    character: vendor?.character || null,
    vocalRange: vendor?.vocalRange || null,
    category: vendor?.category || null,
    voiceSample: vendor?.voiceSample || null,
    mic: vendor?.mic || null,
    software: vendor?.software || null,
    homeStudio: vendor?.homeStudio || null,
    currency: vendor?.currency || null,
    rate: vendor?.rate || null,
    bonus: vendor?.bonus || null,
    qualityBonus: vendor?.qualityBonus || null,
    continuityBonus: vendor?.continuityBonus || null,
    notes: vendor?.notes || null,
    photo: vendor?.photo || null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.voiceTalent.trim()) {
      newErrors.voiceTalent = 'Voice talent es obligatorio'
    }
    if (!formData.vtNewCode.trim()) {
      newErrors.vtNewCode = 'VT new code es obligatorio'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.language) {
      newErrors.language = 'Language es obligatorio'
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit?.(formData)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          {isEditing ? 'Editar Vendor' : 'Nuevo Vendor'}
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {isEditing
            ? 'Modifica la información del vendor'
            : 'Completa la información para crear un nuevo vendor'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Información Básica
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Voice Talent <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={formData.voiceTalent}
                onChange={(e) => handleChange('voiceTalent', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800 ${
                  errors.voiceTalent
                    ? 'border-red-700'
                    : 'border-stone-300 dark:border-stone-600'
                }`}
                required
              />
              {errors.voiceTalent && (
                <p className="mt-1 text-xs text-red-700">{errors.voiceTalent}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                VT New Code <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={formData.vtNewCode}
                onChange={(e) => handleChange('vtNewCode', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800 ${
                  errors.vtNewCode
                    ? 'border-red-700'
                    : 'border-stone-300 dark:border-stone-600'
                }`}
                required
              />
              {errors.vtNewCode && (
                <p className="mt-1 text-xs text-red-700">{errors.vtNewCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800 ${
                  errors.email ? 'border-red-700' : 'border-stone-300 dark:border-stone-600'
                }`}
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Language <span className="text-red-700">*</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value as Language)}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800 ${
                  errors.language ? 'border-red-700' : 'border-stone-300 dark:border-stone-600'
                }`}
                required
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {errors.language && <p className="mt-1 text-xs text-red-700">{errors.language}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Tipo de Vendor
              </label>
              <select
                value={formData.vendorType}
                onChange={(e) => handleChange('vendorType', e.target.value as VendorType)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              >
                {vendorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Gender <span className="text-red-700">*</span>
              </label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', (e.target.value || null) as Gender | null)}
                className={`block w-full px-3 py-2 border rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800 ${
                  errors.gender ? 'border-red-700' : 'border-stone-300 dark:border-stone-600'
                }`}
                required
              >
                <option value="">Seleccionar...</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-700">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Character
              </label>
              <input
                type="text"
                value={formData.character || ''}
                onChange={(e) => handleChange('character', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Vocal Range
              </label>
              <input
                type="text"
                value={formData.vocalRange || ''}
                onChange={(e) => handleChange('vocalRange', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Voice Sample (URL)
              </label>
              <input
                type="url"
                value={formData.voiceSample || ''}
                onChange={(e) => handleChange('voiceSample', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-stone-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-stone-700 dark:text-stone-300">
                Activo
              </label>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Detalles Técnicos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Micrófono
              </label>
              <input
                type="text"
                value={formData.mic || ''}
                onChange={(e) => handleChange('mic', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Software
              </label>
              <input
                type="text"
                value={formData.software || ''}
                onChange={(e) => handleChange('software', e.target.value || null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Home Studio
              </label>
              <textarea
                value={formData.homeStudio || ''}
                onChange={(e) => handleChange('homeStudio', e.target.value || null)}
                rows={3}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Configuración de Pagos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Moneda
              </label>
              <select
                value={formData.currency || ''}
                onChange={(e) => handleChange('currency', (e.target.value || null) as Currency | null)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              >
                <option value="">Seleccionar...</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.rate ?? ''}
                onChange={(e) =>
                  handleChange('rate', e.target.value ? parseFloat(e.target.value) : null)
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="bonus"
                checked={formData.bonus ?? false}
                onChange={(e) => handleChange('bonus', e.target.checked)}
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-stone-300 rounded"
              />
              <label htmlFor="bonus" className="ml-2 block text-sm text-stone-700 dark:text-stone-300">
                Bonus
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Quality Bonus
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.qualityBonus ?? ''}
                onChange={(e) =>
                  handleChange('qualityBonus', e.target.value ? parseFloat(e.target.value) : null)
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Continuity Bonus
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.continuityBonus ?? ''}
                onChange={(e) =>
                  handleChange(
                    'continuityBonus',
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">Notas</h2>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value || null)}
            rows={4}
            className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-800"
            placeholder="Notas adicionales sobre el vendor..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-stone-700 dark:text-stone-300 font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Vendor'}
          </button>
        </div>
      </form>
    </div>
  )
}


