import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { BiLoaderAlt, BiFilterAlt, BiCollection } from "react-icons/bi";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterGenre, setFilterGenre] = useState("All");

  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/media/");
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/media/${id}`);
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (error) {
        alert("Failed to delete movie");
      }
    }
  };

  const handleEdit = (movie) => {
    navigate(`/edit/${movie.id}`, { state: { movie } });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const uniquePlatforms = ["All", ...new Set(movies.map(m => m.platform).filter(Boolean))];
  const uniqueGenres = ["All", ...new Set(movies.map(m => m.genre).filter(Boolean))];

  const filteredMovies = movies.filter(movie => {
    const statusMatch = filterStatus === "All" || movie.status === filterStatus;
    const platformMatch = filterPlatform === "All" || movie.platform === filterPlatform;
    const genreMatch = filterGenre === "All" || movie.genre === filterGenre;
    return statusMatch && platformMatch && genreMatch;
  });

  return (
    // Reduced vertical padding (py-6 instead of py-10)
    <div className="max-w-7xl mx-auto py-6 px-4">
      
      {/* --- COMPACT HEADER --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* Smaller Title (text-2xl instead of 4xl) */}
          <h1 className="text-2xl font-bold text-white tracking-tight">My Collection</h1>
          <p className="text-slate-400 text-xs mt-1">Track your cinematic journey.</p>
        </div>
        
        {/* Smaller Badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700">
            <BiCollection className="text-blue-500 text-sm" />
            <span className="text-white font-bold text-sm">{filteredMovies.length}</span>
            <span className="text-slate-400 text-xs">Items</span>
        </div>
      </div>

      {/* --- SLEEK FILTER BAR --- */}
      {/* Reduced padding (p-2) and rounded-xl */}
      <div className="sticky top-20 z-40 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-white/5 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[10px] pl-2">
                <BiFilterAlt size={14} /> Filters
            </div>

            <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                {/* Inputs are now smaller (py-1.5 text-xs) */}
                <select 
                    className="w-full md:w-32 bg-slate-800 text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">Status</option>
                    <option value="Wishlist">Wishlist</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                </select>

                <select 
                    className="w-full md:w-32 bg-slate-800 text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                >
                    <option value="All">Platform</option>
                    {uniquePlatforms.map(p => p !== "All" && <option key={p} value={p}>{p}</option>)}
                </select>

                <select 
                    className="w-full md:w-32 bg-slate-800 text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                >
                    <option value="All">Genre</option>
                    {uniqueGenres.map(g => g !== "All" && <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            {/* Reset Button */}
            {(filterStatus !== "All" || filterPlatform !== "All" || filterGenre !== "All") && (
                <button 
                    onClick={() => {setFilterStatus("All"); setFilterPlatform("All"); setFilterGenre("All")}}
                    className="text-red-400 hover:text-red-300 text-xs font-medium hover:underline px-2"
                >
                    Reset
                </button>
            )}
        </div>
      </div>

      {/* --- MOVIE GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
            <BiLoaderAlt className="animate-spin text-4xl text-blue-500 mb-4" />
            <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onDelete={handleDelete}
                  onEdit={handleEdit} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <p className="text-slate-500">No movies found.</p>
                <button 
                    onClick={() => {setFilterStatus("All"); setFilterPlatform("All"); setFilterGenre("All")}}
                    className="text-blue-500 text-sm mt-2 hover:underline"
                >
                    Clear Filters
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;