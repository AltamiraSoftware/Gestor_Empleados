export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Página no encontrada</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">La página que buscas no existe.</p>
        <a 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
} 