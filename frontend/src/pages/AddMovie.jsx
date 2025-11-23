import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack, BiSearch, BiLoaderAlt } from "react-icons/bi";


const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    media_type: "Movie",
    poster_url: "",
    director: "",
    genre: "",
    platform: "",
    status: "Wishlist",
    rating: 0,
    review: "",
    total_episodes: 1,
    current_episode: 0
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?query=${searchQuery}`,
        { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`, accept: 'application/json' } }
      );
      const filtered = response.data.results.filter(item => item.media_type === "movie" || item.media_type === "tv");
      setSearchResults(filtered.slice(0, 5));
    } catch (error) {
      console.error("TMDB Error:", error);
      alert("Failed to fetch from TMDB.");
    } finally {
      setSearching(false);
    }
  };

  const selectTMDBMovie = async (item) => {
    setSearchResults([]); 
    setSearchQuery(item.media_type === "movie" ? item.title : item.name);
    setSearching(true); 

    try {
      const isMovie = item.media_type === "movie";
      const endpoint = isMovie ? "movie" : "tv";

      const [detailResponse, providerResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/${endpoint}/${item.id}?append_to_response=credits`, { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } }),
        axios.get(`https://api.themoviedb.org/3/${endpoint}/${item.id}/watch/providers`, { headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` } })
      ]);

      const details = detailResponse.data;
      const providers = providerResponse.data.results;

      let director = "";
      if (isMovie) {
        const dirObj = details.credits.crew.find(person => person.job === "Director");
        director = dirObj ? dirObj.name : "";
      } else {
        director = details.created_by?.length > 0 ? details.created_by[0].name : "";
      }

      const genre = details.genres?.map(g => g.name).slice(0, 2).join(", ") || "";
      
      let platform = "";
      const region = providers["IN"] || providers["US"]; 
      if (region && region.flatrate && region.flatrate.length > 0) {
        platform = region.flatrate[0].provider_name;
      }

      const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";

      setFormData({
        ...formData,
        title: isMovie ? item.title : item.name,
        media_type: isMovie ? "Movie" : "Series",
        poster_url: poster,
        rating: item.vote_average ? (item.vote_average / 2).toFixed(1) : 0, 
        review: item.overview || "", 
        director: director,
        genre: genre,
        platform: platform,
        total_episodes: isMovie ? 1 : (details.number_of_episodes || 1), 
        current_episode: 0
      });

    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
        setSearching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      rating: parseFloat(formData.rating),
      total_episodes: parseInt(formData.total_episodes),
      current_episode: parseInt(formData.current_episode)
    };

    try {
      await axios.post("http://127.0.0.1:8000/media/", payload);
      navigate("/");
    } catch (error) {
      console.error("Error adding media:", error);
      alert("Failed to add movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-lg mx-auto mt-20 mb-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-800">
      
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white transition">
          <BiArrowBack size={20} />
        </button>
        <h2 className="text-xl font-bold text-white">Add New Media</h2>
      </div>

      {/* Search Bar - Compact */}
      <div className="mb-6 relative">
        <div className="flex gap-2">
            <div className="relative w-full">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Auto-fill from TMDB..."
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <button onClick={handleSearch} disabled={searching} className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg transition flex items-center justify-center">
                {searching ? <BiLoaderAlt className="animate-spin" /> : <BiSearch />}
            </button>
        </div>
        
        {/* Dropdown Results */}
        {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                    <div key={item.id} onClick={() => selectTMDBMovie(item)} className="p-2 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 flex justify-between items-center">
                        <div className="truncate pr-2">
                            <div className="font-bold text-white text-sm truncate">{item.media_type === "movie" ? item.title : item.name}</div>
                            <div className="text-[10px] text-slate-400">{item.release_date?.split("-")[0] || "N/A"} • {item.media_type}</div>
                        </div>
                        {item.poster_path && <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt="poster" className="h-8 rounded" />}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Poster Preview  */}
      {formData.poster_url && (
        <div className="flex items-center gap-4 mb-5 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <img src={formData.poster_url} alt="Preview" className="h-20 rounded shadow-sm" />
            <div>
                <h3 className="text-white font-bold text-sm">{formData.title}</h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 mt-1 inline-block">{formData.media_type}</span>
            </div>
        </div>
      )}

    
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Title</label>
            <input name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Type</label>
            <select name="media_type" value={formData.media_type} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="Movie">Movie</option>
              <option value="Series">TV Series</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Director</label><input name="director" value={formData.director} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
          <div><label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Genre</label><input name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
          <div><label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Platform</label><input name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" /></div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Rating</label>
            <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Series Only */}
        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div><label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Watched</label><input type="number" name="current_episode" value={formData.current_episode} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-sm" /></div>
            <div><label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Total</label><input type="number" name="total_episodes" value={formData.total_episodes} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-sm" /></div>
          </div>
        )}

        <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Notes</label>
            <textarea name="review" rows="2" value={formData.review} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 text-sm">
            {loading ? "Saving..." : <><BiSave /> Save Media</>}
        </button>
      </form>
    </div>
  );
}

export default AddMovie;