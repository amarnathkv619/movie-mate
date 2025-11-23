import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { BiLoaderAlt, BiFilterAlt, BiSearch, BiX, BiBot, BiHappy, BiWorld, BiPieChartAlt2 } from "react-icons/bi";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const GENRE_MAP = {
  "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35, "Crime": 80,
  "Documentary": 99, "Drama": 18, "Family": 10751, "Fantasy": 14, "History": 36,
  "Horror": 27, "Music": 10402, "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878,
  "Thriller": 53, "War": 10752, "Western": 37
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterGenre, setFilterGenre] = useState("All");

  // Modals
  const [showRecModal, setShowRecModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false); // <--- NEW STATS MODAL
  const [recMovie, setRecMovie] = useState(null);
  const [recReason, setRecReason] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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

  // --- DATA PREP FOR CHARTS ---
  const getStatusData = () => {
    const counts = { Wishlist: 0, Watching: 0, Completed: 0 };
    movies.forEach(m => { if(counts[m.status] !== undefined) counts[m.status]++; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).filter(d => d.value > 0);
  };

  const getGenreData = () => {
    const counts = {};
    movies.forEach(m => {
      if(!m.genre) return;
      m.genre.split(", ").forEach(g => { counts[g] = (counts[g] || 0) + 1; });
    });
    // Top 5 Genres
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // --- movie recomendation ---
  const handleRecommendation = async () => {
    const completed = movies.filter(m => m.status === "Completed" && m.rating >= 3);
    let favoriteGenre = "Action"; 
    let genreId = 28; 

    if (completed.length > 0) {
      const genreCounts = {};
      completed.forEach(m => {
        if (!m.genre) return;
        const genres = m.genre.split(", ").map(g => g.trim());
        genres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
      });
      const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
      if (sortedGenres.length > 0) {
        favoriteGenre = sortedGenres[0][0];
        if (GENRE_MAP[favoriteGenre]) genreId = GENRE_MAP[favoriteGenre];
      }
    }

    setAiLoading(true);
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`,
            { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } }
        );
        const candidates = response.data.results;
        const existingTitles = new Set(movies.map(m => m.title.toLowerCase()));
        const freshCandidates = candidates.filter(c => !existingTitles.has(c.title.toLowerCase()));

        if (freshCandidates.length > 0) {
            const pick = freshCandidates[Math.floor(Math.random() * freshCandidates.length)];
            setRecMovie({
                title: pick.title,
                poster_url: pick.poster_path ? `https://image.tmdb.org/t/p/w500${pick.poster_path}` : "",
                genre: favoriteGenre,
                platform: "Trending Now",
                rating: (pick.vote_average / 2).toFixed(1),
                media_type: "Movie"
            });
            setRecReason(`Because you like ${favoriteGenre} movies`);
            setShowRecModal(true);
        } else {
            alert("You've watched all the popular movies in this genre!");
        }
    } catch (error) {
        console.error("AI Error:", error);
        alert("Failed to get suggestion from TMDB.");
    } finally {
        setAiLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const uniquePlatforms = ["All", ...new Set(movies.map(m => m.platform).filter(Boolean))];
  const allGenres = movies.map(m => m.genre ? m.genre.split(", ") : []).flat();
  const uniqueGenres = ["All", ...new Set(allGenres)].sort();

  const filteredMovies = movies.filter(movie => {
    const searchMatch = movie.title.toLowerCase().includes(searchTitle.toLowerCase());
    const statusMatch = filterStatus === "All" || movie.status === filterStatus;
    const platformMatch = filterPlatform === "All" || movie.platform === filterPlatform;
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
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      
      {/* --- CONTROL BAR --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
        <div className="flex gap-3 w-full lg:w-auto order-2 lg:order-1">
            <div className="relative w-full lg:w-80 group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><BiSearch size={20} /></div>
                <input type="text" placeholder="Search collection..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" />
                {searchTitle && <button onClick={() => setSearchTitle("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"><BiX size={20} /></button>}
            </div>
            
            <button onClick={handleRecommendation} disabled={aiLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50">
                {aiLoading ? <BiLoaderAlt className="animate-spin" /> : <><BiWorld size={20} /> <span className="hidden sm:inline">Discover</span></>}
            </button>

            {/*  STATS BUTTON */}
            <button onClick={() => setShowStatsModal(true)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 rounded-xl font-bold border border-slate-700 transition flex items-center justify-center gap-2 shrink-0">
                <BiPieChartAlt2 size={20} />
            </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 order-1 lg:order-2">
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-r border-slate-700 pr-4 mr-2 hidden md:flex"><BiFilterAlt size={14} /> Filter By:</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Status</span>
                <select className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition min-w-[100px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="All">All</option><option value="Wishlist">Wishlist</option><option value="Watching">Watching</option><option value="Completed">Completed</option></select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Platform</span>
                <select className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition min-w-[100px]" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}><option value="All">All</option>{uniquePlatforms.map(p => p !== "All" && <option key={p} value={p}>{p}</option>)}</select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Genre</span>
                <select className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800 transition min-w-[100px]" value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}><option value="All">All</option>{uniqueGenres.map(g => g !== "All" && <option key={g} value={g}>{g}</option>)}</select>
            </div>
            {(filterStatus !== "All" || filterPlatform !== "All" || filterGenre !== "All") && <button onClick={clearFilters} className="text-red-400 hover:text-white hover:bg-red-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase transition border border-red-500/30">Reset</button>}
        </div>
      </div>

      {/* --- MOVIE GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20"><BiLoaderAlt className="animate-spin text-4xl text-blue-500 mb-4" /><p className="text-slate-400 text-sm">Loading...</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.length > 0 ? filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} onEdit={handleEdit} />) : <div className="col-span-full py-20 text-center opacity-50"><p className="text-slate-400 mb-3 text-lg">No movies found.</p><button onClick={clearFilters} className="text-blue-400 text-sm hover:underline font-bold">Clear Search & Filters</button></div>}
        </div>
      )}

      {/* --- RECOMMENDATION MODAL --- */}
      {showRecModal && recMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative transform transition-all scale-100">
                <button onClick={() => setShowRecModal(false)} className="absolute top-3 right-3 text-slate-400 hover:text-white z-10 bg-black/50 rounded-full p-1"><BiX size={24} /></button>
                <div className="h-48 relative">
                    {recMovie.poster_url ? <img src={recMovie.poster_url} alt={recMovie.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><BiHappy size={48} className="text-slate-600"/></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                        <div className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md inline-block mb-2 shadow-lg">AI SUGGESTION</div>
                        <h3 className="text-xl font-bold text-white leading-tight">{recMovie.title}</h3>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-400 text-sm italic mb-4">"{recReason}"</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-6">
                        <div className="bg-slate-800 p-2 rounded"><span className="block text-slate-500 font-bold uppercase text-[10px]">Genre</span>{recMovie.genre}</div>
                        <div className="bg-slate-800 p-2 rounded"><span className="block text-slate-500 font-bold uppercase text-[10px]">Status</span>{recMovie.platform}</div>
                    </div>
                    <button onClick={() => { navigate("/add"); setShowRecModal(false); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20">Add to Collection</button>
                </div>
            </div>
        </div>
      )}

      {/* --- STATS MODAL --- */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 relative">
                <button onClick={() => setShowStatsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><BiX size={24} /></button>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><BiPieChartAlt2 className="text-blue-500" /> Collection Stats</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Status Chart */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">By Status</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={getStatusData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {getStatusData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Genre Chart */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Top Genres</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={getGenreData()} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                        {getGenreData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default Home;