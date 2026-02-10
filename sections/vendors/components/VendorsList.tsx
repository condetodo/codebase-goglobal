import { useState } from 'react'
import type {
  VendorsListProps,
  VendorType,
  Language,
  Currency,
  Gender,
} from '../types'

const vendorTypeLabels: Record<VendorType, string> = {
  'Voice Talent': 'Voice Talent',
  Editor: 'Editor',
  Adaptador: 'Adaptador',
  'Editor de Sonido': 'Editor de Sonido',
  QA: 'QA',
  Preflight: 'Preflight',
}

const languageLabels: Record<Language, string> = {
  'Spanish LA': 'Español LA',
  Portuguese: 'Portugués',
  English: 'Inglés',
}

const currencyLabels: Record<Currency, string> = {
  ARS: 'ARS',
  USD: 'USD',
  BRL: 'BRL',
}

const genderLabels: Record<Gender, string> = {
  Male: 'Masculino',
  Female: 'Femenino',
}

export function VendorsList({
  vendors,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onFilter,
  onSearch,
}: VendorsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [vendorTypeFilter, setVendorTypeFilter] = useState<VendorType[]>([])
  const [languageFilter, setLanguageFilter] = useState<Language[]>([])
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState<'voiceTalent' | 'vtNewCode' | 'email' | 'vendorType'>(
    'voiceTalent'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const filteredAndSorted = vendors
    .filter((vendor) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          vendor.voiceTalent.toLowerCase().includes(query) ||
          vendor.vtNewCode.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Vendor type filter
      if (vendorTypeFilter.length > 0 && !vendorTypeFilter.includes(vendor.vendorType)) {
        return false
      }

      // Language filter
      if (languageFilter.length > 0 && !languageFilter.includes(vendor.language)) {
        return false
      }

      // Active filter
      if (activeFilter !== null && vendor.active !== activeFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'voiceTalent':
          comparison = a.voiceTalent.localeCompare(b.voiceTalent)
          break
        case 'vtNewCode':
          comparison = a.vtNewCode.localeCompare(b.vtNewCode)
          break
        case 'email':
          comparison = a.email.localeCompare(b.email)
          break
        case 'vendorType':
          comparison = a.vendorType.localeCompare(b.vendorType)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const applyFilters = () => {
    onFilter?.({
      vendorType: vendorTypeFilter.length > 0 ? vendorTypeFilter : undefined,
      language: languageFilter.length > 0 ? languageFilter : undefined,
      active: activeFilter,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Vendors</h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Gestiona proveedores de doblaje (voice talents, editores, adaptadores, etc.)
            </p>
          </div>
          {onCreate && (
            <button
              onClick={onCreate}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Vendor
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre, código o email..."
            className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent dark:focus:ring-blue-800"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {/* Vendor Type Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Tipo:</span>
            {(
              [
                'Voice Talent',
                'Editor',
                'Adaptador',
                'Editor de Sonido',
                'QA',
                'Preflight',
              ] as VendorType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => {
                  const newFilter = vendorTypeFilter.includes(type)
                    ? vendorTypeFilter.filter((t) => t !== type)
                    : [...vendorTypeFilter, type]
                  setVendorTypeFilter(newFilter)
                }}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  vendorTypeFilter.includes(type)
                    ? 'bg-blue-900 text-white dark:bg-blue-800'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                {vendorTypeLabels[type]}
              </button>
            ))}
          </div>

          {/* Language Filters */}
          <div className="flex items-center gap-2 flex-wrap ml-4">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Idioma:</span>
            {(['Spanish LA', 'Portuguese', 'English'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  const newFilter = languageFilter.includes(lang)
                    ? languageFilter.filter((l) => l !== lang)
                    : [...languageFilter, lang]
                  setLanguageFilter(newFilter)
                }}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  languageFilter.includes(lang)
                    ? 'bg-red-700 text-white dark:bg-red-800'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>

          {/* Active Filter */}
          <div className="flex items-center gap-2 flex-wrap ml-4">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Estado:</span>
            <button
              onClick={() => setActiveFilter(activeFilter === true ? null : true)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilter === true
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === false ? null : false)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilter === false
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
            <thead className="bg-stone-50 dark:bg-stone-900">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => handleSort('voiceTalent')}
                >
                  <div className="flex items-center gap-2">
                    Voice Talent
                    {sortBy === 'voiceTalent' && (
                      <svg
                        className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => handleSort('vtNewCode')}
                >
                  <div className="flex items-center gap-2">
                    Código
                    {sortBy === 'vtNewCode' && (
                      <svg
                        className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortBy === 'email' && (
                      <svg
                        className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Idioma
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                  onClick={() => handleSort('vendorType')}
                >
                  <div className="flex items-center gap-2">
                    Tipo
                    {sortBy === 'vendorType' && (
                      <svg
                        className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Moneda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="text-stone-500 dark:text-stone-400">
                      <svg
                        className="mx-auto h-12 w-12 text-stone-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No se encontraron vendors</p>
                      <p className="text-sm mt-1">
                        {searchQuery ||
                        vendorTypeFilter.length > 0 ||
                        languageFilter.length > 0 ||
                        activeFilter !== null
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Crea tu primer vendor para comenzar'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {vendor.voiceTalent}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {vendor.vtNewCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {vendor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {languageLabels[vendor.language]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {vendorTypeLabels[vendor.vendorType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {vendor.gender ? genderLabels[vendor.gender] : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {vendor.currency ? currencyLabels[vendor.currency] : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900 dark:text-stone-100">
                        {vendor.rate !== null ? vendor.rate : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onToggleActive?.(vendor.id, !vendor.active)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          vendor.active
                            ? 'bg-blue-900 dark:bg-blue-800'
                            : 'bg-stone-200 dark:bg-stone-700'
                        }`}
                        role="switch"
                        aria-checked={vendor.active}
                        aria-label={`${vendor.active ? 'Desactivar' : 'Activar'} vendor`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            vendor.active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(vendor.id)}
                            className="text-blue-900 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Ver vendor"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(vendor.id)}
                            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                            aria-label="Editar vendor"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(vendor.id)}
                            className="text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Eliminar vendor"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      {filteredAndSorted.length > 0 && (
        <div className="mt-4 text-sm text-stone-600 dark:text-stone-400">
          Mostrando {filteredAndSorted.length} de {vendors.length} vendors
        </div>
      )}
    </div>
  )
}


