import React, { useState } from "react";

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
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold mb-3">Contact</h1>
      <p className="text-gray-600 mb-4">Questions or feedback? Send a message below (demo only).</p>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name" className="w-full border p-2 rounded"
        />
        <input
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email" className="w-full border p-2 rounded"
        />
        <textarea
          value={msg} onChange={(e) => setMsg(e.target.value)}
          placeholder="Message" className="w-full border p-2 rounded h-28"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
