import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { BiLoaderAlt, BiFilterAlt } from "react-icons/bi";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
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

  // --- FILTER LOGIC ---
  const uniquePlatforms = ["All", ...new Set(movies.map(m => m.platform).filter(Boolean))];
  const uniqueGenres = ["All", ...new Set(movies.map(m => m.genre).filter(Boolean))];

  const filteredMovies = movies.filter(movie => {
    const statusMatch = filterStatus === "All" || movie.status === filterStatus;
    const platformMatch = filterPlatform === "All" || movie.platform === filterPlatform;
    const genreMatch = filterGenre === "All" || movie.genre === filterGenre;
    return statusMatch && platformMatch && genreMatch;
  });

  return (
    <div className="py-8">
      {/* Header & Count - Stacks on mobile, Row on Desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">My Collection</h1>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-bold text-white">
              {filteredMovies.length} Items
          </span>
        </div>

        {/* FILTERS BAR - Full width on mobile, Auto on Desktop */}
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 text-gray-400 px-2 hidden md:flex">
                <BiFilterAlt /> <span className="text-sm font-bold">Filters:</span>
            </div>

            {/* Mobile Label */}
            <div className="text-gray-400 text-xs uppercase font-bold md:hidden mb-1">
                Filter By:
            </div>

            <div className="grid grid-cols-2 md:flex gap-3">
                {/* Status Filter */}
                <select 
                    className="w-full md:w-auto bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Wishlist">Wishlist</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                </select>

                {/* Platform Filter */}
                <select 
                    className="w-full md:w-auto bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                >
                    <option value="All">All Platforms</option>
                    {uniquePlatforms.map(p => p !== "All" && <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            
            {/* Genre Filter (Full width on mobile) */}
            <select 
                className="w-full md:w-auto bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
            >
                <option value="All">All Genres</option>
                {uniqueGenres.map(g => g !== "All" && <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Reset Button */}
            {(filterStatus !== "All" || filterPlatform !== "All" || filterGenre !== "All") && (
                <button 
                    onClick={() => {setFilterStatus("All"); setFilterPlatform("All"); setFilterGenre("All")}}
                    className="text-red-400 text-xs hover:underline px-2 py-2 md:py-0 text-center w-full md:w-auto"
                >
                    Reset Filters
                </button>
            )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
            <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center text-gray-500 py-20">
                <p className="text-xl">No movies found matching filters.</p>
                <button 
                    onClick={() => {setFilterStatus("All"); setFilterPlatform("All"); setFilterGenre("All")}}
                    className="text-blue-500 mt-2 hover:underline"
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