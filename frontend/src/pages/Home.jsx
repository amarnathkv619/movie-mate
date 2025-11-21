import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { BiLoaderAlt } from "react-icons/bi";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from FastAPI
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

  // 2. Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/media/${id}`);
        // Remove from UI instantly without reloading
        setMovies(movies.filter((movie) => movie.id !== id));
      } catch (error) {
        alert("Failed to delete movie");
      }
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Collection</h1>
        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-bold">
            {movies.length} Items
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
            <BiLoaderAlt className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard 
                key={movie.id} 
                movie={movie} 
                onDelete={handleDelete}
                onEdit={() => alert("Edit coming soon!")} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;