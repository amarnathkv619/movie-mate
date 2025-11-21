import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // <--- Import the real page

// Placeholder for Add
const AddMovie = () => <div className="text-white text-center mt-10">Add Form Coming Soon</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans">
        <Navbar />
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddMovie />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;