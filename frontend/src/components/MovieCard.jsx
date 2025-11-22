import { BiTrash, BiEdit, BiCameraMovie, BiTv } from "react-icons/bi";

function MovieCard({ movie, onDelete, onEdit }) {
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "watching": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 hover:border-blue-500/50 transition group flex flex-col h-full">
      
      {/* Top Row: Status Badge & Rating */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getStatusColor(movie.status)}`}>
          {movie.status}
        </span>
        <div className="text-right">
           <span className="text-2xl font-bold text-blue-400">{movie.rating}</span>
           <span className="text-xs text-gray-500">/ 5</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4 flex-grow">
        <h3 className="text-xl font-bold text-white leading-tight">{movie.title}</h3>
        <p className="text-gray-500 text-xs italic mt-1 mb-3">Directed by {movie.director}</p>
        
        <div className="flex items-center gap-2 text-gray-300 text-sm font-medium bg-slate-900/50 inline-flex px-3 py-1.5 rounded-lg">
          {/* Icon based on type */}
          {movie.media_type === "Movie" ? <BiCameraMovie className="text-blue-400" /> : <BiTv className="text-purple-400" />}
          
          <span>{movie.media_type}</span>
          <span className="text-gray-600">•</span>
          <span>{movie.genre}</span>
          <span className="text-gray-600">•</span>
          <span>{movie.platform}</span>
        </div>
      </div>

      {/* Progress Bar (Only for TV Shows) */}
      {movie.media_type === "Series" && (
        <div className="mb-4">
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

   
      <div className="flex gap-3 justify-end border-t border-gray-700 pt-3 mt-auto">
        <button onClick={() => onEdit(movie)} className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-slate-700" title="Edit">
            <BiEdit size={20} />
        </button>
        <button onClick={() => onDelete(movie.id)} className="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-slate-700" title="Delete">
            <BiTrash size={20} />
        </button>
      </div>
    </div>
  );
}

export default MovieCard;