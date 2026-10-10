import { useContext, useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaHome, FaBars, FaTimes, FaUsers, FaUserCircle } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import dp from "../assets/dp.png";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await axios.get(`${serverUrl}/api/user/search?q=${searchQuery}`, {
          withCredentials: true,
        });
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, serverUrl]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Search Section */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-xl">
            {/* Netflix-Style Monogram Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#E50914] rounded-xl flex items-center justify-center font-black text-white text-2xl tracking-tighter shadow-lg netflix-glow-sm transform group-hover:scale-105 transition-all">
                N
              </div>
              <span className="hidden sm:inline font-black tracking-tighter text-xl text-white">
                NET<span className="text-[#E50914]">CONNECT</span>
              </span>
            </Link>

            {/* Desktop Live Search */}
            <div className="relative flex-1 max-w-md hidden sm:block" ref={searchRef}>
              <div className="relative">
                <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Search creators, skills, roles..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
                />
              </div>

              {/* Search Dropdown */}
              {showResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-zinc-500">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">No results found</div>
                  ) : (
                    searchResults.map((user) => (
                      <Link
                        key={user._id}
                        to={`/profile/${user._id}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-none"
                      >
                        <img
                          src={user.profileImage || dp}
                          alt={user.firstname}
                          className="w-9 h-9 rounded-lg object-cover border border-zinc-700"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-white truncate">
                            {user.firstname} {user.lastname}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {user.headline || `@${user.username}`}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/")
                  ? "text-[#E50914] bg-red-600/10 border border-red-600/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <FaHome className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/network"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/network")
                  ? "text-[#E50914] bg-red-600/10 border border-red-600/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <FaUsers className="w-5 h-5" />
              <span>Network</span>
            </Link>

            <Link
              to="/notifications"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                isActive("/notifications")
                  ? "text-[#E50914] bg-red-600/10 border border-red-600/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <IoMdNotifications className="w-5 h-5" />
              <span>Alerts</span>
              <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-[#E50914] netflix-glow-sm"></span>
            </Link>

            <div className="w-px h-8 bg-zinc-800 mx-2"></div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 group p-1 pr-3 rounded-xl hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800"
              >
                <img
                  src={userData?.profileImage || dp}
                  alt="Profile"
                  className="w-9 h-9 rounded-lg object-cover border border-zinc-700 group-hover:border-red-600 transition-colors"
                />
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-white group-hover:text-red-500 transition-colors">
                    {userData?.firstname} {userData?.lastname}
                  </span>
                  <span className="text-[10px] text-zinc-500">View Profile</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-500 border border-zinc-800 transition-all cursor-pointer"
                title="Logout"
              >
                <BiLogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>

          {/* Mobile Search & Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/profile" className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={userData?.profileImage || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800"
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <IoIosSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NetConnect..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm"
          >
            <FaHome className="w-5 h-5 text-red-500" />
            <span>Home Feed</span>
          </Link>
          <Link
            to="/network"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm"
          >
            <FaUsers className="w-5 h-5 text-red-500" />
            <span>Network Hub</span>
          </Link>
          <Link
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm"
          >
            <IoMdNotifications className="w-5 h-5 text-red-500" />
            <span>Notifications</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm"
          >
            <FaUserCircle className="w-5 h-5 text-red-500" />
            <span>My Profile</span>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/40 text-red-400 font-bold text-sm border border-red-900/40"
          >
            <BiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
