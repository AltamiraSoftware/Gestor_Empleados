import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Gestor de Empleados",
  description: "Sistema de gestión de empleados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`h-full ${inter.className}`}>
      <body className="h-full bg-gray-100 dark:bg-dark-bg">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
