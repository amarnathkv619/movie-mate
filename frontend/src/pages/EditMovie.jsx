import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack } from "react-icons/bi";

function EditMovie() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve passed data
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Initialize form with existing data (or empty if missing)
  const [formData, setFormData] = useState(state?.movie || {
    title: "",
    media_type: "Movie",
    director: "",
    genre: "",
    platform: "",
    status: "Wishlist",
    rating: 0,
    review: "",
    total_episodes: 1,
    current_episode: 0
  });

  // Safety Check: If user refreshed page and lost state, go back home
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
      // PUT Request to update
      await axios.put(`http://127.0.0.1:8000/media/${id}`, payload);
      navigate("/");
    } catch (error) {
      console.error("Error updating media:", error);
      alert("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  if (!state?.movie) return null; // Don't render if redirecting

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

        {/* Status & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none">
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Rating</label>
            <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none" />
          </div>
        </div>

        {/* TV Series Progress */}
        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div>
               <label className="block text-gray-400 text-sm mb-2">Watched</label>
               <input type="number" name="current_episode" value={formData.current_episode} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
            <div>
               <label className="block text-gray-400 text-sm mb-2">Total</label>
               <input type="number" name="total_episodes" value={formData.total_episodes} onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2">
          {loading ? "Updating..." : <><BiSave /> Update Media</>}
        </button>
      </form>
    </div>
  );
}

export default EditMovie;