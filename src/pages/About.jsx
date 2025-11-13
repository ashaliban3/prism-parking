import React from "react";
import { FaCar, FaLeaf, FaMapMarkedAlt } from "react-icons/fa"; // npm install react-icons

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-4">
          About Prism Parking
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Prism Parking is a next-generation smart parking prototype. Our goal is to make finding parking faster, greener, and more efficient — starting with a clean and intuitive user interface.
        </p>

        {/* Vision Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to simplify urban parking with real-time data, intuitive maps, and reliable availability indicators. The current version demonstrates front-end features using React and Tailwind CSS, with simulated data and interactivity.
          </p>
        </section>

        {/* Values Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all">
            <FaMapMarkedAlt className="text-emerald-600 text-4xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Smart Mapping</h3>
            <p className="text-gray-600 text-sm">
              Plan your route and find the most convenient lot before you arrive.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all">
            <FaLeaf className="text-emerald-600 text-4xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Eco-Friendly Focus</h3>
            <p className="text-gray-600 text-sm">
              Reduce emissions by minimizing idle driving and wasted time.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all">
            <FaCar className="text-emerald-600 text-4xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Simple Experience</h3>
            <p className="text-gray-600 text-sm">
              Clean, clear design to help you find and reserve parking in seconds.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
