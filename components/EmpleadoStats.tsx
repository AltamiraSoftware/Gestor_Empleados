'use client'

import { Card, Title, AreaChart } from "@tremor/react"
import { Empleado } from "@/lib/supabase/empleados"

interface EmpleadoStatsProps {
  empleado: Empleado
  promediosDepartamento: {
    salarioPromedio: number
    empleadosTotal: number
  }
}

export function EmpleadoStats({ empleado, promediosDepartamento }: EmpleadoStatsProps) {
  // Datos simulados de rendimiento (podrías reemplazarlo con datos reales)
  const datosRendimiento = [
    {
      mes: 'Ene',
      rendimiento: 85
    },
    {
      mes: 'Feb',
      rendimiento: 88
    },
    {
      mes: 'Mar',
      rendimiento: 92
    },
    // ... más datos
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">
          Comparación Salarial
        </Title>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Salario Actual
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {empleado.salario.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Promedio Departamento
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {promediosDepartamento.salarioPromedio.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">
          Rendimiento Mensual
        </Title>
        <AreaChart
          data={datosRendimiento}
          index="mes"
          categories={['rendimiento']}
          colors={['blue']}
          className="h-48"
        />
      </Card>
    </div>
  )
} 