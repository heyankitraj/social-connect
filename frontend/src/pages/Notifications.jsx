import { useState } from "react";
import { Header } from "../components/Header";
import { IoMdNotifications, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserPlus, FaHeart, FaComment, FaBriefcase, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "connect",
      title: "New Connection Request",
      message: "Ankit Raj sent you an invitation to connect on NetConnect.",
      time: "10 minutes ago",
      read: false,
      link: "/network",
    },
    {
      id: 2,
      type: "like",
      title: "Post Interaction",
      message: "Elena Vance and 14 others reacted to your latest article.",
      time: "2 hours ago",
      read: false,
      link: "/",
    },
    {
      id: 3,
      type: "comment",
      title: "New Discussion Comment",
      message: "Marcus Thorne commented: 'Brilliant perspective on next-gen architecture!'",
      time: "5 hours ago",
      read: true,
      link: "/",
    },
    {
      id: 4,
      type: "job",
      title: "Trending Role Spotlight",
      message: "Netflix Streaming Architecture team is looking for Senior Full Stack Engineers.",
      time: "1 day ago",
      read: true,
      link: "/",
    },
    {
      id: 5,
      type: "network",
      title: "Connection Accepted",
      message: "Sarah Connor accepted your connection invitation. Say hello!",
      time: "2 days ago",
      read: true,
      link: "/network",
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "connect":
        return <FaUserPlus className="w-4 h-4 text-red-500" />;
      case "like":
        return <FaHeart className="w-4 h-4 text-pink-500" />;
      case "comment":
        return <FaComment className="w-4 h-4 text-blue-400" />;
      case "job":
        return <FaBriefcase className="w-4 h-4 text-amber-400" />;
      default:
        return <IoMdNotifications className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <IoMdNotifications className="w-4 h-4 text-red-500" />
              Activity Stream
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Notifications & Alerts
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs border border-zinc-800 transition-all cursor-pointer"
            >
              <IoMdCheckmarkCircleOutline className="w-4 h-4 text-emerald-400" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold text-xs border border-red-900/40 transition-all cursor-pointer"
              title="Clear all"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#E50914] text-white netflix-glow-sm"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-[#E50914] text-white netflix-glow-sm"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
            <IoMdNotifications className="w-16 h-16 mx-auto mb-3 text-zinc-700" />
            <p className="text-lg font-bold text-zinc-300">You're completely caught up!</p>
            <p className="text-sm text-zinc-500 mt-1">No new notifications in this view.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <Link
                key={notif.id}
                to={notif.link}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                  notif.read
                    ? "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
                    : "bg-zinc-900 border-red-600/40 hover:border-red-600/80 shadow-lg shadow-red-950/10"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-white">{notif.title}</p>
                    <span className="text-[11px] text-zinc-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E50914] netflix-glow-sm flex-shrink-0 mt-2"></div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
