import { BiTrash, BiEdit, BiCameraMovie, BiTv, BiStar } from "react-icons/bi";

function MovieCard({ movie, onDelete, onEdit }) {
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "watching": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-slate-700/50 text-slate-400 border-slate-600/50";
    }
  };

  return (
    <div className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* --- POSTER IMAGE SECTION --- */}
      <div className="relative h-56 overflow-hidden">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-700">
            <BiCameraMovie size={64} />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${getStatusColor(movie.status)}`}>
            {movie.status}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-yellow-400 font-bold text-sm shadow-lg">
           <BiStar /> <span>{movie.rating}</span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-grow -mt-4 relative z-10">
        
        {/* Title Row with Actions (Flexbox to split Title left, Buttons right) */}
        <div className="flex justify-between items-start mb-3">
            <div className="pr-2">
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                    {movie.title}
                </h3>
                <p className="text-slate-500 text-xs font-medium mt-1">
                    {movie.director ? `Dir. ${movie.director}` : "Director Unknown"}
                </p>
            </div>

            {/* Buttons - Now Top Right (Visible on hover for cleaner look) */}
            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                    onClick={() => onEdit(movie)} 
                    className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                    title="Edit"
                >
                    <BiEdit size={20} />
                </button>
                <button 
                    onClick={() => onDelete(movie.id)} 
                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                    title="Delete"
                >
                    <BiTrash size={20} />
                </button>
            </div>
        </div>

        {/* Meta Tags (Genre/Platform) */}
        <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1.5 rounded-md border border-slate-700/50">
                {movie.media_type === "Movie" ? <BiCameraMovie className="text-blue-400" /> : <BiTv className="text-purple-400" />}
                {movie.genre?.split(",")[0]}
            </div>
            {movie.platform && (
                <div className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1.5 rounded-md border border-slate-700/50">
                    {movie.platform}
                </div>
            )}
        </div>

        {/* Progress Bar (TV Only) */}
        {movie.media_type === "Series" && (
          <div className="mt-auto">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1.5">
              <span>Season Progress</span>
              <span>{Math.round((movie.current_episode / (movie.total_episodes || 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full" 
                style={{ width: `${(movie.current_episode / (movie.total_episodes || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MovieCard;