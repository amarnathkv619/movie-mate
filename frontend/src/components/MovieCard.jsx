import { BiTrash, BiEdit } from "react-icons/bi";

function MovieCard({ movie, onDelete, onEdit }) {
  // Helper to pick colors based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "watching": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 hover:border-blue-500/50 transition group">
      <div className="flex justify-between items-start">
        <div>
          <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getStatusColor(movie.status)}`}>
            {movie.status}
          </span>
          <h3 className="text-xl font-bold text-white mt-2">{movie.title}</h3>
          <p className="text-gray-400 text-sm">{movie.genre} • {movie.platform}</p>
        </div>
        <div className="text-right">
           <span className="text-2xl font-bold text-blue-400">{movie.rating}</span>
           <span className="text-xs text-gray-500 block">/ 5</span>
        </div>
      </div>

      {/* Progress Bar for TV Shows */}
      {movie.media_type === "Series" && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{movie.current_episode} / {movie.total_episodes || "?"} ep</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${(movie.current_episode / (movie.total_episodes || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3 justify-end border-t border-gray-700 pt-3">
        <button onClick={() => onEdit(movie)} className="text-gray-400 hover:text-white transition">
            <BiEdit size={20} />
        </button>
        <button onClick={() => onDelete(movie.id)} className="text-red-400 hover:text-red-300 transition">
            <BiTrash size={20} />
        </button>
      </div>
    </div>
  );
}

export default MovieCard;