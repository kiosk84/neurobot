export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 p-4">
      <div className="text-center max-w-md">
        {/* Анимация загрузки */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border-4 border-blue-400/50 animate-spin"></div>
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            НейроБот
          </span>
        </h2>

        <p className="text-gray-400 mb-6 animate-pulse">
          Загрузка интерфейса...
        </p>

        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
            style={{
              animation: 'progress 2s ease-in-out infinite alternate',
              width: '60%'
            }}
          ></div>
        </div>

        {/* Анимация прогресса */}
        <style>{`
          @keyframes progress {
            0% { width: 30%; }
            100% { width: 80%; }
          }
        `}</style>
      </div>
    </div>
  );
}
