import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // npm install framer-motion
import { FaMapMarkerAlt, FaClock, FaCar } from "react-icons/fa"; // npm install react-icons
import parkingImage from "../assets/image_nov12_757pm.jpg";
export default function Home() {
  const [demoData, setDemoData] = useState(null);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        const json = await res.json();
        setDemoData(json);
      } catch (err) {
        setDemoData({ error: "Failed to fetch demo data" });
      }
    };
    fetchDemo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 md:py-32">
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold text-emerald-700"
          >
            Prism Parking
          </motion.h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-md">
            Find parking faster and smarter — track availability, set favorites, 
            and reserve in seconds.
          </p>

          <div className="flex justify-center md:justify-start space-x-4 pt-4">
            <a
              href="/map"
              className="bg-emerald-600 hover:bg-emerald-700 transition-all text-white px-6 py-3 rounded-lg shadow-lg"
            >
              Find Parking
            </a>
            <a
              href="/about"
              className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex-1 flex justify-center mt-12 md:mt-0"
        >
        <img
        src={parkingImage}
        alt="Parking"
        className="w-80 md:w-96 lg:w-[28rem] rounded-xl shadow-lg object-cover"
      />


        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section className="bg-white py-16 px-6 md:px-16 border-t border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose Prism Parking?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-emerald-50 hover:bg-emerald-100 transition-all p-8 rounded-2xl shadow-sm text-center">
            <FaMapMarkerAlt className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Location</h3>
            <p className="text-gray-600">
              See live parking availability and navigate directly to open spots.
            </p>
          </div>

          <div className="bg-emerald-50 hover:bg-emerald-100 transition-all p-8 rounded-2xl shadow-sm text-center">
            <FaClock className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p className="text-gray-600">
              Skip the stress — find, reserve, and park in seconds.
            </p>
          </div>

          <div className="bg-emerald-50 hover:bg-emerald-100 transition-all p-8 rounded-2xl shadow-sm text-center">
            <FaCar className="text-emerald-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">
              Reduce idling and emissions with efficient parking discovery.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-6 mt-auto text-center text-gray-500 text-sm">
        {demoData ? (
          <p className="text-xs text-gray-400">
            Demo API fetched successfully ✅ (todo ID: {demoData.id})
          </p>
        ) : (
          <p className="text-xs text-gray-400">Loading demo data...</p>
        )}
        <p className="mt-2">© 2025 Prism Parking. All rights reserved.</p>
      </footer>
    </div>
  );
}

