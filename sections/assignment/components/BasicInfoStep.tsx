import { useState } from 'react'
import type { OrderCreationData, Show, ProductType } from '../types'

interface BasicInfoStepProps {
  initialData: Partial<OrderCreationData>
  shows: Show[]
  onNext: (data: Partial<OrderCreationData>) => void
  onCancel?: () => void
}

const productTypeLabels: Record<ProductType, string> = {
  miniserie: 'Miniserie',
  serie: 'Serie',
  pelicula: 'Película',
  documental: 'Documental',
}

const languageOptions = [
  { value: 'es-AR', label: 'Español Argentina (es-AR)' },
  { value: 'es-MX', label: 'Español México (es-MX)' },
  { value: 'pt-BR', label: 'Portugués Brasil (pt-BR)' },
  { value: 'es-ES', label: 'Español España (es-ES)' },
]

export function BasicInfoStep({ initialData, shows, onNext, onCancel }: BasicInfoStepProps) {
  const [productType, setProductType] = useState<ProductType>(
    (initialData.productType as ProductType) || 'serie'
  )
  const [episodeCount, setEpisodeCount] = useState(initialData.episodeCount?.toString() || '1')
  const [language, setLanguage] = useState(initialData.language || 'es-AR')
  const [showId, setShowId] = useState(initialData.showId || '')
  const [showName, setShowName] = useState(initialData.showName || '')
  const [isCreatingNewShow, setIsCreatingNewShow] = useState(false)
  const [newShowName, setNewShowName] = useState('')
  const [newShowDescription, setNewShowDescription] = useState('')

  const selectedShow = shows.find((s) => s.id === showId)

  const handleNext = () => {
    const data: Partial<OrderCreationData> = {
      productType,
      episodeCount: parseInt(episodeCount, 10),
      language,
      showId: isCreatingNewShow ? 'new' : showId,
      showName: isCreatingNewShow ? newShowName : selectedShow?.name || showName,
    }
    onNext(data)
  }

  const isValid =
    productType &&
    episodeCount &&
    parseInt(episodeCount, 10) >= 1 &&
    language &&
    (isCreatingNewShow ? newShowName.trim() : showId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Información Básica
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Completa la información básica de la Order (Show)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Producto */}
        <div>
          <label
            htmlFor="productType"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
          >
            Tipo de Producto <span className="text-red-500">*</span>
          </label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
            className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(productTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad de Episodios */}
        <div>
          <label
            htmlFor="episodeCount"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
          >
            Cantidad de Capítulos/Episodios <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="episodeCount"
            value={episodeCount}
            onChange={(e) => setEpisodeCount(e.target.value)}
            min="1"
            className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Mínimo 1 episodio
          </p>
        </div>

        {/* Idioma */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
          >
            Idioma <span className="text-red-500">*</span>
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Show/Serie */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Show/Serie <span className="text-red-500">*</span>
          </label>
          {!isCreatingNewShow ? (
            <div className="space-y-2">
              <select
                value={showId}
                onChange={(e) => setShowId(e.target.value)}
                className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar show existente</option>
                {shows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {show.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCreatingNewShow(true)}
                className="text-sm text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                + Crear nuevo show
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-900/50">
              <div>
                <label
                  htmlFor="newShowName"
                  className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                >
                  Nombre del Show <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="newShowName"
                  value={newShowName}
                  onChange={(e) => setNewShowName(e.target.value)}
                  className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Dark Secrets"
                />
              </div>
              <div>
                <label
                  htmlFor="newShowDescription"
                  className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                >
                  Descripción (opcional)
                </label>
                <textarea
                  id="newShowDescription"
                  value={newShowDescription}
                  onChange={(e) => setNewShowDescription(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del show..."
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNewShow(false)
                  setNewShowName('')
                  setNewShowDescription('')
                }}
                className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              >
                ← Usar show existente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
          className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente: Asignar Vendors
        </button>
      </div>
    </div>
  )
}

