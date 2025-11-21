import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";


const Home = () => <div className="p-8 text-white text-center text-2xl">🎥 Movie List Coming Soon...</div>;
const AddMovie = () => <div className="p-8 text-white text-center text-2xl">📝 Add Form Coming Soon...</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Navbar />
        <div className="container mx-auto p-4">
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