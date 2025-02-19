'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import React from 'react'

interface FechaFormateadaProps {
  fecha: string
}

export function FechaFormateada({ fecha }: FechaFormateadaProps) {
  return (
    <span className="text-gray-700 dark:text-gray-300">
      {format(new Date(fecha), 'dd MMM yyyy', { locale: es })}
    </span>
  )
} 