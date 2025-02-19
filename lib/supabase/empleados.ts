import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Empleado {
  id: string
  nombre: string
  cargo: string
  departamento: string
  salario: number
  fecha_contratacion: string
}

export interface NuevoEmpleado {
  nombre: string
  cargo: string
  departamento: string
  salario: number
  fecha_contratacion: string
}

interface FiltrosBusqueda {
  nombre?: string
  departamento?: string
  salario_min?: number
  salario_max?: number
}

interface EmpleadoData {
  departamento: string;
  [key: string]: any;
}

// Obtener todos los empleados con filtros opcionales
export async function obtenerEmpleados(filtros?: FiltrosBusqueda) {
  let query = supabase
    .from('empleados')
    .select('*')

  if (filtros) {
    if (filtros.nombre) {
      query = query.ilike('nombre', `%${filtros.nombre}%`)
    }
    if (filtros.departamento) {
      query = query.eq('departamento', filtros.departamento)
    }
    if (filtros.salario_min) {
      query = query.gte('salario', filtros.salario_min)
    }
    if (filtros.salario_max) {
      query = query.lte('salario', filtros.salario_max)
    }
  }

  const { data, error } = await query

  if (error) throw error
  return data as Empleado[]
}

// Agregar nuevo empleado
export async function agregarEmpleado(empleado: NuevoEmpleado) {
  console.log('Intentando agregar empleado:', empleado) // Para debug

  const { data, error } = await supabase
    .from('empleados')
    .insert([{
      nombre: empleado.nombre,
      cargo: empleado.cargo,
      departamento: empleado.departamento,
      salario: Number(empleado.salario),
      fecha_contratacion: empleado.fecha_contratacion
    }])
    .select()

  if (error) {
    console.error('Error detallado:', error) // Para ver el error completo
    throw error
  }

  return data?.[0] || null
}

// Actualizar empleado
export async function actualizarEmpleado(id: string, empleado: Partial<Empleado>) {
  const { data, error } = await supabase
    .from('empleados')
    .update(empleado)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar empleado:', error)
    throw error
  }

  return data
}

// Eliminar empleado
export async function eliminarEmpleado(id: string) {
  const { error } = await supabase
    .from('empleados')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar empleado:', error)
    throw error
  }

  return true
}

// Obtener departamentos únicos
export async function obtenerDepartamentos() {
  const { data, error } = await supabase
    .from('empleados')
    .select('departamento')

  if (error) throw error
  
  // Filtrar departamentos únicos usando reduce
  const departamentosUnicos = data.reduce((acc: string[], item: EmpleadoData) => {
    if (!acc.includes(item.departamento)) {
      acc.push(item.departamento)
    }
    return acc
  }, [])
  
  return departamentosUnicos
}

// Obtener un empleado por ID
export async function obtenerEmpleado(id: string) {
  const { data, error } = await supabase
    .from('empleados')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error al obtener empleado:', error)
    throw error
  }

  return data
} 