import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page imports
import Home from "./pages/Home";
import Map from "./pages/Map";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar fixed at the top */}
        <Navbar />

        {/* Main content — add padding-top so it’s not hidden behind the fixed navbar */}
        <main className="flex-grow pt-20 pb-8 max-w-6xl mx-auto px-4 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer at bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
