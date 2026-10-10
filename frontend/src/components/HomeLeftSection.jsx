import dp from "../assets/dp.png";
import { FaPencilAlt, FaMapMarkerAlt, FaBriefcase, FaUserCheck, FaCamera } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function HomeLeftSection() {
  const { userData, setIsEditing, postData } = useContext(userDataContext);

  if (!userData) return null;

  const myPostsCount = postData.filter(
    (p) => (p.author?._id || p.author)?.toString() === userData._id?.toString()
  ).length;

  return (
    <div className="w-full sm:w-[28%] lg:w-[24%] h-fit bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-red-600/40 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Cover Image */}
      <div
        className="w-full h-28 bg-gradient-to-br from-black via-zinc-900 to-[#280709] relative overflow-hidden cursor-pointer group"
        onClick={() => setIsEditing(true)}
      >
        {userData.coverImage ? (
          <img
            src={userData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              NetConnect Creator
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
        <div className="absolute right-3 top-3 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaCamera className="w-3.5 h-3.5 text-red-500" />
        </div>
      </div>

      {/* Avatar */}
      <div className="relative flex justify-center -mt-12 px-6">
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsEditing(true)}
        >
          <img
            className="w-20 h-20 rounded-2xl border-4 border-zinc-900 object-cover shadow-2xl netflix-glow-sm group-hover:border-red-600 transition-all duration-300"
            src={userData.profileImage || dp}
            alt="Profile"
          />
          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <FaCamera className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="text-center px-6 py-4">
        <Link
          to="/profile"
          className="font-black text-lg text-white hover:text-[#E50914] transition-colors block truncate"
        >
          {userData.firstname} {userData.lastname}
        </Link>
        <span className="text-xs text-zinc-500 block mb-2">@{userData.username}</span>

        {userData.headline ? (
          <p className="text-xs text-zinc-300 font-medium line-clamp-2 leading-relaxed">
            {userData.headline}
          </p>
        ) : (
          <p className="text-xs text-zinc-500 italic">Add your headline...</p>
        )}

        {userData.location && (
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-zinc-400">
            <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
            <span>{userData.location}</span>
          </div>
        )}
      </div>

      {/* Stats Divider */}
      <div className="border-t border-zinc-800/80 mx-4"></div>

      {/* Stats Section */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center text-center">
          <Link to="/network" className="flex-1 hover:opacity-80 transition-opacity">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Connections</p>
            <p className="text-base font-black text-white mt-0.5">
              {userData.connections?.length || 0}
            </p>
          </Link>

          <div className="w-px h-8 bg-zinc-800"></div>

          <Link to="/profile" className="flex-1 hover:opacity-80 transition-opacity">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posts</p>
            <p className="text-base font-black text-white mt-0.5">
              {myPostsCount}
            </p>
          </Link>
        </div>
      </div>

      {/* Edit Profile Action */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-xs py-3 rounded-2xl shadow-lg netflix-glow-sm hover:scale-[102%] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaPencilAlt className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
