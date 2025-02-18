'use client'

import { Card, Title, BarChart, DonutChart } from "@tremor/react"
import { Empleado } from "@/lib/supabase/empleados"

interface DashboardProps {
  empleados: Empleado[]
}

export function Dashboard({ empleados }: DashboardProps) {
  // Calcular estadísticas
  const totalEmpleados = empleados.length
  const salarioPromedio = empleados.reduce((acc, emp) => acc + emp.salario, 0) / totalEmpleados

  // Datos por departamento
  const departamentosStats = empleados.reduce((acc, emp) => {
    if (!acc[emp.departamento]) {
      acc[emp.departamento] = {
        departamento: emp.departamento,
        empleados: 0,
        salarioTotal: 0
      }
    }
    acc[emp.departamento].empleados++
    acc[emp.departamento].salarioTotal += emp.salario
    return acc
  }, {} as Record<string, { departamento: string; empleados: number; salarioTotal: number }>)

  const departamentosData = Object.values(departamentosStats).map(dep => ({
    name: dep.departamento,
    'Empleados': dep.empleados,
    'Salario Promedio': Math.round(dep.salarioTotal / dep.empleados)
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tarjetas de resumen */}
      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">Total Empleados</Title>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {totalEmpleados}
        </p>
      </Card>

      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">Salario Promedio</Title>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {salarioPromedio.toLocaleString('es-ES', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
        </p>
      </Card>

      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">Departamentos</Title>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {Object.keys(departamentosStats).length}
        </p>
      </Card>

      <Card className="p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300">Salario Más Alto</Title>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {Math.max(...empleados.map(emp => emp.salario)).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })}
        </p>
      </Card>

      {/* Gráficas */}
      <Card className="col-span-full md:col-span-2 p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300 mb-4">
          Empleados por Departamento
        </Title>
        <BarChart
          data={departamentosData}
          index="name"
          categories={['Empleados']}
          colors={['blue']}
          className="h-72"
        />
      </Card>

      <Card className="col-span-full md:col-span-2 p-4 dark:bg-dark-card">
        <Title className="text-gray-700 dark:text-gray-300 mb-4">
          Salario Promedio por Departamento
        </Title>
        <DonutChart
          data={departamentosData}
          category="Salario Promedio"
          index="name"
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
          className="h-72"
        />
      </Card>
    </div>
  )
} 