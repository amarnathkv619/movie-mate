import { Link } from "react-router-dom";
import { BiMoviePlay, BiPlusCircle, BiCollection } from "react-icons/bi"; 

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <BiMoviePlay className="text-white text-xl" />
            </div>
         
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              MovieMate
            </span>
          </Link>

       
          <div className="flex items-center gap-6">
            {/* Collection Link (Hidden on very small screens) */}
            <Link 
              to="/" 
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <BiCollection className="text-lg" />
              <span>My Collection</span>
            </Link>
            
            <Link 
              to="/add" 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <BiPlusCircle className="text-lg" />
              <span>Add Movie</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;