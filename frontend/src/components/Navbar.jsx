import { Link } from "react-router-dom";
import { BiMoviePlay, BiPlusCircle } from "react-icons/bi"; 

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-500 hover:text-blue-400 transition">
          <BiMoviePlay />
          <span>MovieMate</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-400 transition font-medium text-slate-300 hover:text-white">
            My Collection
          </Link>
          
          <Link 
            to="/add" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition font-semibold shadow-md hover:shadow-blue-500/20"
          >
            <BiPlusCircle className="text-xl" />
            <span>Add Movie</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;