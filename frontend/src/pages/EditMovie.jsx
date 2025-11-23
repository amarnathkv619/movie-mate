import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack } from "react-icons/bi";

function EditMovie() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Initialize form with existing data
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

  // Redirect if no state found 
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
    <div className="max-w-2xl mx-auto mt-10 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition">
          <BiArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white">Edit Media</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Title</label>
            <input name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Type</label>
            <select name="media_type" value={formData.media_type} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500">
              <option value="Movie">Movie</option>
              <option value="Series">TV Series</option>
            </select>
          </div>
        </div>

        {/* Director, Genre, Platform */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Director</label>
            <input name="director" value={formData.director || ""} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Genre</label>
            <input name="genre" value={formData.genre || ""} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Platform</label>
            <input name="platform" value={formData.platform || ""} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Status & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500">
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Rating (0-5)</label>
            <input type="number" step="0.1" max="5" min="0" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* TV Series Progress */}
        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div>
               <label className="block text-gray-400 text-sm mb-2">Watched Episodes</label>
               <input type="number" name="current_episode" value={formData.current_episode} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
            <div>
               <label className="block text-gray-400 text-sm mb-2">Total Episodes</label>
               <input type="number" name="total_episodes" value={formData.total_episodes} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
          </div>
        )}

        {/* Review / Notes Section */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Review / Notes</label>
          <textarea 
            name="review" 
            rows="4"
            value={formData.review || ""}
            onChange={handleChange}
            className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-blue-500 text-sm"
            placeholder="Write your thoughts here..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2">
          {loading ? "Updating..." : <><BiSave /> Update Media</>}
        </button>
      </form>
    </div>
  );
}

export default EditMovie;