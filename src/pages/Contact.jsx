import React, { useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots } from "react-icons/fa"; // npm install react-icons

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks ${name || "friend"}! (This is a demo — no form submission.)`);
    setName(""); setEmail(""); setMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Have questions or feedback? Drop a message below — we’d love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-emerald-500" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-emerald-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3 text-emerald-500" />
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Your message"
              className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 h-32 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-all shadow-md"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
