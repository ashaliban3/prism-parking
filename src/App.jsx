
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Map from "./pages/Map";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProtectedApp from "./components/ProtectedApp";

// export default function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Navbar />

//         <main className="flex-grow pt-20 pb-8 max-w-6xl mx-auto px-4 w-full">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/map" element={<ProtectedApp><Map /></ProtectedApp>} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//           </Routes>
//         </main>

//         <Footer />
//       </div>
//     </Router>
//   );
// }
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLog from "./pages/AdminLog";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Navbar />

      <div className="pt-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLog />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}