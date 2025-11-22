import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack, BiSearch, BiLoaderAlt } from "react-icons/bi";

// ---------------------------------------------------------
// 🔑 PASTE YOUR TOKEN HERE
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Nzk3NTViNjM0MTE5N2M4MTZlNDJkZGMyZDVjZmU1MyIsIm5iZiI6MTc1NTk2NzM4NC4wMzIsInN1YiI6IjY4YTllZjk4ZjM2ZGIxN2RjNThkMWFiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mzZKh691a4BR7dAL7WB60ye4kYcX1klRYXF36VpefKY"; 
// ---------------------------------------------------------

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Added poster_url to state
  const [formData, setFormData] = useState({
    title: "",
    media_type: "Movie",
    poster_url: "", // <--- New Field
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

      // Fetch Details & Providers
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

      // GRAB POSTER URL
      const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";

      setFormData({
        ...formData,
        title: isMovie ? item.title : item.name,
        media_type: isMovie ? "Movie" : "Series",
        poster_url: poster, // <--- Save it here
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
    <div className="max-w-2xl mx-auto mt-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition">
          <BiArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white">Add New Media</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-600/50">
        <label className="block text-blue-400 text-sm font-bold mb-2 uppercase tracking-wider">✨ Auto-Fill from TMDB</label>
        <div className="flex gap-2">
            <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search movie name..."
                className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500"
            />
            <button onClick={handleSearch} disabled={searching} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold transition flex items-center">
                {searching ? <BiLoaderAlt className="animate-spin" /> : <BiSearch size={20} />}
            </button>
        </div>
        {/* Dropdown */}
        {searchResults.length > 0 && (
            <div className="mt-2 bg-slate-700 rounded-lg overflow-hidden border border-slate-600 shadow-xl z-50 absolute w-full max-w-lg">
                {searchResults.map((item) => (
                    <div key={item.id} onClick={() => selectTMDBMovie(item)} className="p-3 hover:bg-blue-600/20 cursor-pointer border-b border-slate-600/50 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-white">{item.media_type === "movie" ? item.title : item.name}</div>
                            <div className="text-xs text-gray-400">{item.release_date || item.first_air_date || "N/A"}</div>
                        </div>
                        {item.poster_path && <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt="poster" className="h-10 rounded" />}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Poster Preview in Form */}
      {formData.poster_url && (
        <div className="flex justify-center mb-6">
            <img src={formData.poster_url} alt="Preview" className="h-40 rounded-lg shadow-lg border border-slate-600" />
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-6 border-t border-slate-700 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Title *</label>
            <input name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Type</label>
            <select name="media_type" value={formData.media_type} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none">
              <option value="Movie">Movie</option>
              <option value="Series">TV Series</option>
            </select>
          </div>
        </div>
        
        {/* ... (The rest of your inputs remain the same as before) ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-gray-400 text-sm mb-2">Director</label><input name="director" value={formData.director} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" /></div>
          <div><label className="block text-gray-400 text-sm mb-2">Genre</label><input name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" /></div>
          <div><label className="block text-gray-400 text-sm mb-2">Platform</label><input name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none">
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div><label className="block text-gray-400 text-sm mb-2">Rating (0-5)</label><input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" /></div>
        </div>

        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div><label className="block text-gray-400 text-sm mb-2">Watched Episodes</label><input type="number" name="current_episode" value={formData.current_episode} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" /></div>
            <div><label className="block text-gray-400 text-sm mb-2">Total Episodes</label><input type="number" name="total_episodes" value={formData.total_episodes} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" /></div>
          </div>
        )}

        <div><label className="block text-gray-400 text-sm mb-2">Review / Notes</label><textarea name="review" rows="3" value={formData.review} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none text-sm"></textarea></div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2">{loading ? "Saving..." : <><BiSave /> Save Media</>}</button>
      </form>
    </div>
  );
}

export default AddMovie;