const My_button = () => {
  return (
    <div className="relative">
        {/* Ikona unutar search bara */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        {/* Input polje */}
        <input
            type="text"
            placeholder="Search ranges..."
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
  )
}

export default My_button