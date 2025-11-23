import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack } from "react-icons/bi";

function EditMovie() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(state?.movie || {
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

  useEffect(() => {
    if (!state?.movie) {
      alert("Please select a movie from the list to edit.");
      navigate("/");
    }
  }, [state, navigate]);

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
      await axios.put(`http://127.0.0.1:8000/media/${id}`, payload);
      navigate("/");
    } catch (error) {
      console.error("Error updating media:", error);
      alert("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  if (!state?.movie) return null;

  return (
    
    <div className="max-w-md mx-auto mt-20 mb-10 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white transition"><BiArrowBack size={20} /></button>
            <h2 className="text-lg font-bold text-white">Edit Media</h2>
        </div>
        {/* Tiny Poster Preview */}
        {formData.poster_url && <img src={formData.poster_url} alt="Poster" className="h-10 w-10 object-cover rounded-md border border-slate-600" />}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Row 1: Title & Type */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Title</label>
            <input name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Type</label>
            <select name="media_type" value={formData.media_type} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500">
              <option value="Movie">Movie</option>
              <option value="Series">Series</option>
            </select>
          </div>
        </div>

        {/* Row 2: Director & Platform */}
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Director</label><input name="director" value={formData.director || ""} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500" /></div>
          <div><label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Platform</label><input name="platform" value={formData.platform || ""} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500" /></div>
        </div>

        {/* Row 3: Genre */}
        <div><label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Genre</label><input name="genre" value={formData.genre || ""} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500" /></div>

        {/* Row 4: Status & Rating */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500">
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold mb-0.5">Rating</label>
            <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Series Only */}
        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
            <div><label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Watched</label><input type="number" name="current_episode" value={formData.current_episode} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-xs" /></div>
            <div><label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Total</label><input type="number" name="total_episodes" value={formData.total_episodes} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-xs" /></div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">Notes</label>
          <textarea 
            name="review" 
            rows="3" 
            value={formData.review || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 resize-none"
            placeholder="Write your thoughts..."
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-green-500/20 transition flex items-center justify-center gap-2 text-sm mt-2">
          {loading ? "Updating..." : <><BiSave /> Update Media</>}
        </button>
      </form>
    </div>
  );
}

export default EditMovie;