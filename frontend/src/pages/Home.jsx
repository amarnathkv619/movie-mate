import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { BiLoaderAlt, BiFilterAlt, BiSearch, BiX } from "react-icons/bi";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTitle, setSearchTitle] = useState("");
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

  // --- UPDATED LOGIC START ---

  // 1. Get Unique Platforms (Same as before)
  const uniquePlatforms = ["All", ...new Set(movies.map(m => m.platform).filter(Boolean))];

  // 2. Get Unique Individual Genres (SPLIT Logic)

  const allGenres = movies
    .map(m => m.genre ? m.genre.split(", ") : [])
    .flat();
  const uniqueGenres = ["All", ...new Set(allGenres)].sort();

  // 3. Filter Logic (INCLUDES Logic)
  const filteredMovies = movies.filter(movie => {
    const searchMatch = movie.title.toLowerCase().includes(searchTitle.toLowerCase());
    const statusMatch = filterStatus === "All" || movie.status === filterStatus;
    const platformMatch = filterPlatform === "All" || movie.platform === filterPlatform;
    
    // Check if the movie's genre string contains the selected genre
    const genreMatch = filterGenre === "All" || (movie.genre && movie.genre.includes(filterGenre));
    
    return searchMatch && statusMatch && platformMatch && genreMatch;
  });

 

  const clearFilters = () => {
    setSearchTitle("");
    setFilterStatus("All");
    setFilterPlatform("All");
    setFilterGenre("All");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        
        {/* LEFT: Search Bar */}
        <div className="relative w-full md:w-96 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <BiSearch size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Search your collection..." 
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
            {searchTitle && (
                <button 
                    onClick={() => setSearchTitle("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                    <BiX size={20} />
                </button>
            )}
        </div>

        {/* RIGHT: Filters */}
        <div className="flex flex-wrap items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mr-2">
                <BiFilterAlt /> Filter:
            </div>

            <select 
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="All">Status</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
            </select>

            <select 
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
            >
                <option value="All">Platform</option>
                {uniquePlatforms.map(p => p !== "All" && <option key={p} value={p}>{p}</option>)}
            </select>

            <select 
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
            >
                <option value="All">Genre</option>
                {uniqueGenres.map(g => g !== "All" && <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Item Count Badge */}
            <div className="ml-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-400">
                {filteredMovies.length}
            </div>
        </div>
      </div>

      {/* --- MOVIE GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
            <BiLoaderAlt className="animate-spin text-4xl text-blue-500 mb-4" />
            <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="col-span-full py-20 text-center opacity-50">
                <p className="text-slate-400 mb-3 text-lg">No movies found.</p>
                <button 
                    onClick={clearFilters}
                    className="text-blue-400 text-sm hover:underline font-bold"
                >
                    Clear Search & Filters
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;