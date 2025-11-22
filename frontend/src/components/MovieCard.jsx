import { useState } from "react";
import { BiTrash, BiEdit, BiCameraMovie, BiTv, BiStar, BiNote, BiTime } from "react-icons/bi";

function MovieCard({ movie, onDelete, onEdit }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-500/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]";
      case "watching": return "bg-amber-500/80 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]";
      default: return "bg-slate-700/80 text-slate-300";
    }
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className="group h-96 perspective-[1000px] cursor-pointer" 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-all duration-700 transform-3d ${isFlipped ? "rotate-y-180" : ""}`}>
        
        {/* FRONT SIDE */}
        <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/30 transition-all flex flex-col">
            
            {/* --- Poster  --- */}
            <div className="relative h-40 overflow-hidden shrink-0"> {/* Changed from h-52 to h-40 */}
                {movie.poster_url ? (
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-700">
                        <BiCameraMovie size={64} />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                
                <div className="absolute top-2 left-2">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10 ${getStatusColor(movie.status)}`}>
                        {movie.status}
                    </span>
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/10 px-2 py-0.5 rounded-lg text-yellow-400 font-bold text-xs shadow-lg">
                    <BiStar className="text-yellow-400" /> <span>{movie.rating}</span>
                </div>
            </div>

            {/* --- Info Section --- */}
            <div className="p-4 flex flex-col grow relative">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-medium">
                      {movie.director ? `Dir. ${movie.director}` : "Director Unknown"}
                    </p>
                </div>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-1.5 mb-auto">
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-slate-300 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                        {movie.media_type === "Movie" ? <BiCameraMovie className="text-blue-400" /> : <BiTv className="text-purple-400" />}
                        <span>{movie.media_type}</span>
                        <span className="text-slate-600">•</span>
                        <span>{movie.genre?.split(",")[0] || "N/A"}</span>
                    </div>
                    {movie.platform && (
                      <div className="text-[9px] font-bold uppercase text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                          {movie.platform}
                      </div>
                    )}
                </div>

                {/* Progress Bar (TV Only) */}
                {movie.media_type === "Series" && (
                  <div className="mt-3 mb-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((movie.current_episode / (movie.total_episodes || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${(movie.current_episode / (movie.total_episodes || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-800/50">
                    <span className="text-[10px] text-blue-500 font-bold animate-pulse flex items-center gap-1">
                       <BiTime /> Click for Review
                    </span>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => handleAction(e, () => onEdit(movie))} 
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <BiEdit size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleAction(e, () => onDelete(movie.id))} 
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition"
                          title="Delete"
                        >
                          <BiTrash size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/*  BACK SIDE (REVIEW)  */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-slate-900 p-5 text-slate-200 rotate-y-180 backface-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest">
                    <BiNote size={14} /> Review
                </div>
                <div className="text-yellow-400 text-xs font-bold">
                  {movie.rating}/5 Stars
                </div>
            </div>

            <div className="overflow-y-auto grow pr-2 custom-scrollbar">
                {movie.review ? (
                    <p className="text-sm leading-6 text-slate-300 font-light">"{movie.review}"</p>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <BiEdit size={28} className="mb-2 opacity-50" />
                        <p className="text-xs font-medium">No review added yet.</p>
                    </div>
                )}
            </div>

            <button 
               onClick={(e) => handleAction(e, () => onEdit(movie))}
               className="mt-3 w-full py-2 bg-slate-800 hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
               Edit Details
            </button>
        </div>

      </div>
    </div>
  );
}

export default MovieCard;