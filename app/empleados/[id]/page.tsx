'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerEmpleado, actualizarEmpleado, Empleado } from '@/lib/supabase/empleados'
import { FechaFormateada } from '@/components/FechaFormateada'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DetalleEmpleado({ params }: PageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [editando, setEditando] = useState(false)
  const [datosEditados, setDatosEditados] = useState<Partial<Empleado>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      cargarEmpleado()
    }
  }, [id])

  async function cargarEmpleado() {
    try {
      const data = await obtenerEmpleado(id)
      setEmpleado(data)
      setDatosEditados(data)
    } catch (error) {
      console.error('Error al cargar empleado:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGuardar() {
    if (!empleado || !datosEditados) return

    try {
      await actualizarEmpleado(id, datosEditados)
      setEditando(false)
      cargarEmpleado()
      alert('Empleado actualizado con éxito')
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      alert('Error al actualizar empleado')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Cargando...</div>
      </div>
    )
  }

  if (!empleado) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Empleado no encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow">
          {/* Cabecera */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editando ? (
                      <input
                        type="text"
                        className="px-2 py-1 border rounded dark:bg-dark-bg dark:border-dark-border dark:text-white"
                        value={datosEditados.nombre || ''}
                        onChange={(e) => setDatosEditados({ ...datosEditados, nombre: e.target.value })}
                      />
                    ) : (
                      empleado.nombre
                    )}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">{empleado.cargo}</p>
                </div>
              </div>
              <div className="space-x-2">
                {editando ? (
                  <>
                    <button
                      onClick={handleGuardar}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditando(false)
                        setDatosEditados(empleado)
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditando(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Información laboral
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cargo
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                        value={datosEditados.cargo || ''}
                        onChange={(e) => setDatosEditados({ ...datosEditados, cargo: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{empleado.cargo}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Departamento
                    </label>
                    {editando ? (
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                        value={datosEditados.departamento || ''}
                        onChange={(e) => setDatosEditados({ ...datosEditados, departamento: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{empleado.departamento}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Salario
                    </label>
                    {editando ? (
                      <input
                        type="number"
                        className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                        value={datosEditados.salario || ''}
                        onChange={(e) => setDatosEditados({ ...datosEditados, salario: parseFloat(e.target.value) })}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {empleado.salario.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Información adicional
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fecha de contratación
                    </label>
                    {editando ? (
                      <input
                        type="date"
                        className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border dark:text-white"
                        value={datosEditados.fecha_contratacion || ''}
                        onChange={(e) => setDatosEditados({ ...datosEditados, fecha_contratacion: e.target.value })}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        <FechaFormateada fecha={empleado.fecha_contratacion} />
                      </p>
                    )}
                  </div>
                  {/* Puedes agregar más campos aquí */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Volver al listado
          </button>
        </div>
      </div>
    </div>
  )
} 