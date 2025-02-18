'use client'

import { useState } from 'react'

interface FiltrosBusqueda {
  nombre?: string
  departamento?: string
  salarioMin?: string
  salarioMax?: string
}

interface BuscadorAvanzadoProps {
  departamentos: string[]
  onBuscar: (filtros: FiltrosBusqueda) => void
}

export default function BuscadorAvanzado({ departamentos, onBuscar }: BuscadorAvanzadoProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    nombre: '',
    departamento: '',
    salarioMin: '',
    salarioMax: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBuscar(filtros)
  }

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      departamento: '',
      salarioMin: '',
      salarioMax: ''
    })
    onBuscar({})
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full px-4 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white dark:placeholder-gray-400"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          />
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
      </div>

      {mostrarFiltros && (
        <div className="mt-4 p-4 bg-white dark:bg-dark-card rounded-lg shadow border dark:border-dark-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Departamento
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                  value={filtros.departamento}
                  onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
                >
                  <option value="">Todos los departamentos</option>
                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salario mínimo
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                    value={filtros.salarioMin}
                    onChange={(e) => setFiltros({ ...filtros, salarioMin: e.target.value })}
                    placeholder="Min €"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salario máximo
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                    value={filtros.salarioMax}
                    onChange={(e) => setFiltros({ ...filtros, salarioMax: e.target.value })}
                    placeholder="Max €"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border"
              >
                Limpiar filtros
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 