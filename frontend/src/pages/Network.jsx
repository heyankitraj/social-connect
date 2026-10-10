import { useContext, useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import dp from "../assets/dp.png";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUsers, FaUserCheck, FaTimes, FaCheck } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import gsap from "gsap";

export default function Network() {
  const [activeTab, setActiveTab] = useState("invitations"); // 'invitations' | 'connections' | 'discover'
  const [invitations, setInvitations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const { serverUrl } = useContext(authDataContext);
  const { userData, getCurrentUser } = useContext(userDataContext);
  const containerRef = useRef(null);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const [reqsRes, connsRes, suggRes] = await Promise.allSettled([
        axios.get(`${serverUrl}/api/connection/allrequests`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/connection`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true }),
      ]);

      if (reqsRes.status === "fulfilled") setInvitations(reqsRes.value.data || []);
      if (connsRes.status === "fulfilled") setConnections(connsRes.value.data || []);
      if (suggRes.status === "fulfilled") setSuggested(suggRes.value.data || []);
    } catch (error) {
      console.error("Network fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, [serverUrl]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".network-card"),
        { opacity: 0, y: 25, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab, loading]);

  const handleAccept = async (requestId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: true }));
      await axios.post(`${serverUrl}/api/connection/accept/${requestId}`, {}, { withCredentials: true });
      setInvitations((prev) => prev.filter((inv) => inv._id !== requestId));
      fetchNetworkData();
      if (getCurrentUser) getCurrentUser();
    } catch (error) {
      console.error("Accept error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: true }));
      await axios.post(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true });
      setInvitations((prev) => prev.filter((inv) => inv._id !== requestId));
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleSendConnection = async (targetUserId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: true }));
      await axios.post(`${serverUrl}/api/connection/send/${targetUserId}`, {}, { withCredentials: true });
      setSuggested((prev) => prev.filter((u) => u._id !== targetUserId));
    } catch (error) {
      console.error("Send request error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleRemoveConnection = async (targetUserId) => {
    if (!window.confirm("Are you sure you want to remove this connection?")) return;
    try {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: true }));
      await axios.post(`${serverUrl}/api/connection/remove/${targetUserId}`, {}, { withCredentials: true });
      setConnections((prev) => prev.filter((c) => (c._id || c) !== targetUserId));
      if (getCurrentUser) getCurrentUser();
    } catch (error) {
      console.error("Remove connection error:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={containerRef}>
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden p-8 mb-8 border border-zinc-800 bg-gradient-to-r from-black via-zinc-900 to-[#1e0708] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <IoSparkles className="w-3.5 h-3.5 text-red-500" />
              NetConnect Talent Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Grow Your <span className="text-[#E50914] netflix-text-shadow">Global Network</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Connect with top creators, engineers, and visionaries shaping the entertainment & technology frontier.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-zinc-800/80">
            <button
              onClick={() => setActiveTab("invitations")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "invitations"
                  ? "bg-[#E50914] text-white netflix-glow-sm scale-105"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Invitations</span>
              {invitations.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-white text-black">
                  {invitations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("connections")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "connections"
                  ? "bg-[#E50914] text-white netflix-glow-sm scale-105"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <FaUserCheck className="w-4 h-4" />
              <span>My Connections</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">
                {connections.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "discover"
                  ? "bg-[#E50914] text-white netflix-glow-sm scale-105"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <FaUsers className="w-4 h-4" />
              <span>Discover Creators</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">
                {suggested.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600/30 border-t-[#E50914] rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 font-medium">Scanning NetConnect Network...</p>
          </div>
        ) : (
          <>
            {/* Tab 1: Invitations */}
            {activeTab === "invitations" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-200">
                    Pending Invitations ({invitations.length})
                  </h2>
                </div>

                {invitations.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-600">
                      <FaUserPlus className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-bold text-zinc-300 mb-1">No pending invitations</p>
                    <p className="text-sm text-zinc-500 mb-6">Explore creators and send connection requests!</p>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-sm transition-all netflix-glow-sm"
                    >
                      Discover People
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv) => {
                      const sender = inv.sender;
                      if (!sender) return null;
                      return (
                        <div
                          key={inv._id}
                          className="network-card bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-red-600/50 p-5 transition-all duration-300 shadow-xl flex flex-col justify-between"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <Link to={`/profile/${sender._id}`} className="relative flex-shrink-0">
                              <img
                                src={sender.profileImage || dp}
                                alt={sender.firstname}
                                className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-zinc-900"></div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/profile/${sender._id}`}
                                className="font-bold text-base text-white hover:text-[#E50914] transition-colors truncate block"
                              >
                                {sender.firstname} {sender.lastname}
                              </Link>
                              <p className="text-xs text-zinc-400 truncate mt-0.5">{sender.headline || "NetConnect Member"}</p>
                              <p className="text-[11px] text-zinc-500 mt-1">@{sender.username}</p>
                            </div>
                          </div>

                          <div className="flex gap-2.5 pt-3 border-t border-zinc-800">
                            <button
                              onClick={() => handleAccept(inv._id)}
                              disabled={actionLoading[inv._id]}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-xs transition-all netflix-glow-sm disabled:opacity-50 cursor-pointer"
                            >
                              <FaCheck className="w-3.5 h-3.5" />
                              <span>{actionLoading[inv._id] ? "Accepting..." : "Accept"}</span>
                            </button>
                            <button
                              onClick={() => handleReject(inv._id)}
                              disabled={actionLoading[inv._id]}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-all border border-zinc-700 disabled:opacity-50 cursor-pointer"
                            >
                              <FaTimes className="w-3.5 h-3.5" />
                              <span>Ignore</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: My Connections */}
            {activeTab === "connections" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-200">
                    Your Connections ({connections.length})
                  </h2>
                </div>

                {connections.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                    <p className="text-lg font-bold text-zinc-300 mb-1">No connections yet</p>
                    <p className="text-sm text-zinc-500 mb-6">Build your professional network on NetConnect.</p>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-sm transition-all netflix-glow-sm"
                    >
                      Explore Suggestions
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {connections.map((c) => {
                      if (!c) return null;
                      return (
                        <div
                          key={c._id}
                          className="network-card bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700 p-5 transition-all duration-300 shadow-xl flex flex-col items-center text-center group"
                        >
                          <Link to={`/profile/${c._id}`} className="relative mb-3">
                            <img
                              src={c.profileImage || dp}
                              alt={c.firstname}
                              className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-700 group-hover:border-red-600 transition-colors"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
                          </Link>

                          <Link
                            to={`/profile/${c._id}`}
                            className="font-bold text-base text-white hover:text-[#E50914] transition-colors truncate w-full"
                          >
                            {c.firstname} {c.lastname}
                          </Link>
                          <p className="text-xs text-zinc-400 truncate w-full mt-1">
                            {c.headline || "NetConnect Professional"}
                          </p>
                          <span className="text-[11px] text-zinc-500 mt-0.5">@{c.username}</span>

                          <div className="w-full flex gap-2 mt-5 pt-4 border-t border-zinc-800">
                            <Link
                              to={`/profile/${c._id}`}
                              className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-all border border-zinc-700"
                            >
                              View Profile
                            </Link>
                            <button
                              onClick={() => handleRemoveConnection(c._id)}
                              disabled={actionLoading[c._id]}
                              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold text-xs transition-all border border-red-900/40 cursor-pointer"
                              title="Disconnect"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Discover Creators */}
            {activeTab === "discover" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-200">
                    Recommended For You ({suggested.length})
                  </h2>
                </div>

                {suggested.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                    <p className="text-lg font-bold text-zinc-300">You are connected with all suggested members!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {suggested.map((user) => (
                      <div
                        key={user._id}
                        className="network-card bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-red-600/50 p-5 transition-all duration-300 shadow-xl flex flex-col items-center text-center relative overflow-hidden group"
                      >
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-red-600/20 border border-red-600/40 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                          Suggested
                        </div>

                        <Link to={`/profile/${user._id}`} className="mt-3 mb-3">
                          <img
                            src={user.profileImage || dp}
                            alt={user.firstname}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-700 group-hover:border-red-600 group-hover:scale-105 transition-all duration-300"
                          />
                        </Link>

                        <Link
                          to={`/profile/${user._id}`}
                          className="font-bold text-base text-white hover:text-[#E50914] transition-colors truncate w-full"
                        >
                          {user.firstname} {user.lastname}
                        </Link>
                        <p className="text-xs text-zinc-400 truncate w-full mt-1">
                          {user.headline || "Professional at NetConnect"}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">@{user.username}</p>

                        {user.skills && user.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mt-3 max-h-12 overflow-hidden">
                            {user.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-semibold text-zinc-300 border border-zinc-700/60"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => handleSendConnection(user._id)}
                          disabled={actionLoading[user._id]}
                          className="w-full mt-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-xs transition-all netflix-glow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FaUserPlus className="w-3.5 h-3.5" />
                          <span>{actionLoading[user._id] ? "Connecting..." : "Connect"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
