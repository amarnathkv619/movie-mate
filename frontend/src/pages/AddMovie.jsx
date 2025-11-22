import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiSave, BiArrowBack } from "react-icons/bi";

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert numbers before sending (API expects integers/floats)
    const payload = {
      ...formData,
      rating: parseFloat(formData.rating),
      total_episodes: parseInt(formData.total_episodes),
      current_episode: parseInt(formData.current_episode)
    };

    try {
      await axios.post("http://127.0.0.1:8000/media/", payload);
      // Success! Go back to home list
      navigate("/");
    } catch (error) {
      console.error("Error adding media:", error);
      alert("Failed to add movie. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition">
          <BiArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white">Add New Media</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Title *</label>
            <input 
              name="title" required 
              onChange={handleChange}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none" 
              placeholder="e.g. Inception" 
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Type</label>
            <select 
              name="media_type" 
              onChange={handleChange}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none"
            >
              <option value="Movie">Movie</option>
              <option value="Series">TV Series</option>
            </select>
          </div>
        </div>

        {/* Row 2: Director, Genre, Platform */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Director</label>
            <input name="director" onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none" placeholder="Director" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Genre</label>
            <input name="genre" onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none" placeholder="Sci-Fi" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Platform</label>
            <input name="platform" onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none" placeholder="Netflix" />
          </div>
        </div>

        {/* Row 3: Status & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select 
              name="status" 
              onChange={handleChange}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none"
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Watching">Watching</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Rating (0-5)</label>
            <input 
              type="number" step="0.1" max="5" min="0"
              name="rating" 
              onChange={handleChange} 
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none" 
            />
          </div>
        </div>

        {/* Row 4: TV Series Specifics (Conditional) */}
        {formData.media_type === "Series" && (
          <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div>
               <label className="block text-gray-400 text-sm mb-2">Watched Episodes</label>
               <input type="number" name="current_episode" onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
            <div>
               <label className="block text-gray-400 text-sm mb-2">Total Episodes</label>
               <input type="number" name="total_episodes" onChange={handleChange} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2" />
            </div>
          </div>
        )}

        {/* Review */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Review / Notes</label>
          <textarea 
            name="review" rows="3"
            onChange={handleChange}
            className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 focus:border-blue-500 outline-none"
            placeholder="What did you think?"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
        >
          {loading ? "Saving..." : <><BiSave /> Save Media</>}
        </button>

      </form>
    </div>
  );
}

export default AddMovie;