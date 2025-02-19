'use client'

import { useState, useEffect } from 'react'
import { obtenerEmpleados, Empleado, agregarEmpleado, eliminarEmpleado, actualizarEmpleado, obtenerDepartamentos } from '@/lib/supabase/empleados'
import dynamic from 'next/dynamic'
import { useTheme } from '@/contexts/ThemeContext'
import BuscadorAvanzado from '@/components/BuscadorAvanzado'
import Link from 'next/link'
import { Dashboard } from '@/components/Dashboard'

// Componente para formatear la fecha con renderizado del lado del cliente
const FechaFormateada = dynamic(() => import('@/components/FechaFormateada').then(mod => mod.FechaFormateada), {
  ssr: false,
})

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState<Empleado[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    cargo: '',
    departamento: '',
    salario: '',
    fecha_contratacion: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    cargarEmpleados()
    cargarDepartamentos()
  }, [])

  async function cargarEmpleados() {
    try {
      const data = await obtenerEmpleados()
      setEmpleados(data)
    } catch (error) {
      console.error('Error al cargar empleados:', error)
    }
  }

  async function cargarDepartamentos() {
    try {
      const deps = await obtenerDepartamentos()
      setDepartamentos(deps)
    } catch (error) {
      console.error('Error al cargar departamentos:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      // Validar que el salario sea un número válido
      const salario = parseFloat(nuevoEmpleado.salario)
      if (isNaN(salario)) {
        alert('Por favor, ingrese un salario válido')
        return
      }

      const nuevoEmpleadoData = {
        nombre: nuevoEmpleado.nombre.trim(),
        cargo: nuevoEmpleado.cargo.trim(),
        departamento: nuevoEmpleado.departamento.trim(),
        salario: salario,
        fecha_contratacion: nuevoEmpleado.fecha_contratacion
      }

      console.log('Datos a enviar:', nuevoEmpleadoData) // Para debug

      const resultado = await agregarEmpleado(nuevoEmpleadoData)
      
      if (resultado) {
        setMostrarFormulario(false)
        await cargarEmpleados()
        setNuevoEmpleado({
          nombre: '',
          cargo: '',
          departamento: '',
          salario: '',
          fecha_contratacion: new Date().toISOString().split('T')[0]
        })
        alert('Empleado agregado con éxito')
      }
    } catch (error: any) {
      console.error('Error completo:', error)
      alert(`Error al agregar empleado: ${error.message || 'Error desconocido'}`)
    }
  }

  async function handleEliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await eliminarEmpleado(id)
        cargarEmpleados()
      } catch (error) {
        console.error('Error al eliminar empleado:', error)
      }
    }
  }

  async function handleBusqueda(filtros: any) {
    try {
      let empleadosFiltrados = [...empleados]

      if (filtros.nombre) {
        empleadosFiltrados = empleadosFiltrados.filter(emp => 
          emp.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        )
      }

      if (filtros.departamento) {
        empleadosFiltrados = empleadosFiltrados.filter(emp => 
          emp.departamento === filtros.departamento
        )
      }

      if (filtros.salarioMin) {
        empleadosFiltrados = empleadosFiltrados.filter(emp => 
          emp.salario >= parseFloat(filtros.salarioMin)
        )
      }

      if (filtros.salarioMax) {
        empleadosFiltrados = empleadosFiltrados.filter(emp => 
          emp.salario <= parseFloat(filtros.salarioMax)
        )
      }

      setEmpleadosFiltrados(empleadosFiltrados)
    } catch (error) {
      console.error('Error al filtrar empleados:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      <div className="container mx-auto p-6">
        {/* Botón de tema y título */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Panel de Control
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            <button 
              onClick={() => setMostrarFormulario(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Agregar Empleado
            </button>
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard empleados={empleados} />

        {/* Buscador y Tabla */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border">
            <BuscadorAvanzado
              departamentos={departamentos}
              onBuscar={handleBusqueda}
            />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-border">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" className="rounded dark:bg-dark-bg dark:border-dark-border" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Cargo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Departamento</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Salario</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Fecha Contratación</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                {(empleadosFiltrados.length > 0 ? empleadosFiltrados : empleados).map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded dark:bg-dark-bg dark:border-dark-border" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                        <div className="font-medium text-gray-900 dark:text-white">{empleado.nombre}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{empleado.cargo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{empleado.departamento}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {empleado.salario.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      <FechaFormateada fecha={empleado.fecha_contratacion} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/empleados/${empleado.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Ver detalles
                      </Link>
                      <button
                        onClick={() => handleEliminar(empleado.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal con fondo oscuro */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-card p-6 rounded-lg w-96 max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nuevo Empleado</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={nuevoEmpleado.nombre}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={nuevoEmpleado.cargo}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, cargo: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departamento</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={nuevoEmpleado.departamento}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, departamento: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salario</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={nuevoEmpleado.salario}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, salario: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Contratación</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={nuevoEmpleado.fecha_contratacion}
                    onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, fecha_contratacion: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
