import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import dp from "../assets/dp.png";
import { FaUserPlus, FaFire, FaExternalLinkAlt } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export default function HomeRightSection() {
  const [suggested, setSuggested] = useState([]);
  const [connecting, setConnecting] = useState({});
  const { serverUrl } = useContext(authDataContext);

  const newsItems = [
    { title: "Generative AI reshaping streaming pipelines", reads: "18,420 readers", tag: "AI TECH" },
    { title: "Real-time WebSockets vs HTTP/3 in production", reads: "12,940 readers", tag: "SYSTEM DESIGN" },
    { title: "Netflix engineering highlights micro-frontends", reads: "9,810 readers", tag: "DEV ARCHITECTURE" },
    { title: "Cloud cost optimization strategies for 2026", reads: "7,230 readers", tag: "INFRA" },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/suggested`, {
          withCredentials: true,
        });
        setSuggested((res.data || []).slice(0, 4));
      } catch (err) {
        console.error("Suggestions error:", err);
      }
    };
    fetchSuggestions();
  }, [serverUrl]);

  const handleConnect = async (userId) => {
    try {
      setConnecting((prev) => ({ ...prev, [userId]: true }));
      await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true });
      setSuggested((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Connect error:", err);
    } finally {
      setConnecting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="w-full lg:w-[28%] space-y-6 hidden lg:block">
      {/* Trending News Card */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FaFire className="w-4 h-4 text-[#E50914]" />
            <h3 className="font-black text-sm text-white tracking-tight uppercase">NetConnect News</h3>
          </div>
          <span className="text-[10px] font-bold text-red-500 bg-red-600/10 px-2 py-0.5 rounded-full border border-red-600/20">
            Top Stories
          </span>
        </div>

        <div className="space-y-4">
          {newsItems.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 group-hover:bg-red-600/20 group-hover:text-red-400 transition-colors">
                  {item.tag}
                </span>
                <span className="text-[10px] text-zinc-500">{item.reads}</span>
              </div>
              <p className="text-xs font-bold text-zinc-300 group-hover:text-white group-hover:translate-x-1 transition-all leading-snug">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Creators Card */}
      {suggested.length > 0 && (
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <IoSparkles className="w-4 h-4 text-[#E50914]" />
              <h3 className="font-black text-sm text-white tracking-tight uppercase">Suggested Creators</h3>
            </div>
            <Link to="/network" className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {suggested.map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-3">
                <Link to={`/profile/${user._id}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                  <img
                    src={user.profileImage || dp}
                    alt={user.firstname}
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-700 group-hover:border-red-600 transition-colors flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-white group-hover:text-red-500 transition-colors truncate">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {user.headline || `@${user.username}`}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => handleConnect(user._id)}
                  disabled={connecting[user._id]}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-[#E50914] text-zinc-300 hover:text-white font-bold text-xs border border-zinc-700 hover:border-red-600 transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                >
                  {connecting[user._id] ? "..." : "+ Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
