import { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import EditProfile from "../components/EditProfile";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import dp from "../assets/dp.png";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaPencilAlt,
  FaUserPlus,
  FaUserCheck,
  FaCalendarAlt,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import gsap from "gsap";
import moment from "moment";

export default function Profile() {
  const { id } = useParams();
  const { userData, isEditing, setIsEditing, postData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'experience' | 'skills'

  const profileRef = useRef(null);
  const isOwnProfile = !id || id === userData?._id;

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      if (isOwnProfile) {
        setProfileUser(userData);
      } else {
        const res = await axios.get(`${serverUrl}/api/user/${id}`, { withCredentials: true });
        setProfileUser(res.data);

        // Fetch connection status with this user
        const statusRes = await axios.get(`${serverUrl}/api/connection/getstatus/${id}`, {
          withCredentials: true,
        });
        setConnectStatus(statusRes.data?.status || "Connect");
      }
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id, userData, isOwnProfile]);

  useEffect(() => {
    if (!loading && profileRef.current) {
      gsap.fromTo(
        profileRef.current.querySelectorAll(".animate-section"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading, activeTab]);

  const handleConnectAction = async () => {
    if (!id || isConnecting) return;
    try {
      setIsConnecting(true);
      if (connectStatus === "Connect") {
        await axios.post(`${serverUrl}/api/connection/send/${id}`, {}, { withCredentials: true });
        setConnectStatus("Pending");
      } else if (connectStatus === "Disconnect") {
        if (window.confirm("Remove this connection?")) {
          await axios.post(`${serverUrl}/api/connection/remove/${id}`, {}, { withCredentials: true });
          setConnectStatus("Connect");
        }
      }
    } catch (error) {
      console.error("Connection action error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const currentDisplayUser = isOwnProfile ? userData : profileUser;
  const userPosts = postData.filter(
    (p) => (p.author?._id || p.author)?.toString() === (currentDisplayUser?._id)?.toString()
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {isEditing && <EditProfile />}
      <Header />

      {loading || !currentDisplayUser ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-red-600/30 border-t-[#E50914] rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-medium">Loading Creator Profile...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={profileRef}>
          {/* Hero Banner Card */}
          <div className="animate-section relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-8">
            {/* Cover Image with Netflix cinematic gradient */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-[#280709]">
              {currentDisplayUser.coverImage ? (
                <img
                  src={currentDisplayUser.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center opacity-40">
                    <IoSparkles className="w-16 h-16 text-red-500 mx-auto mb-2" />
                    <p className="text-sm uppercase tracking-widest text-zinc-400 font-bold">
                      NetConnect Featured Profile
                    </p>
                  </div>
                </div>
              )}
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
            </div>

            {/* Profile Info Container */}
            <div className="relative px-6 sm:px-10 pb-8 -mt-24 sm:-mt-28">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-6">
                {/* Avatar with Red Ambient Glow */}
                <div className="relative group">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-[#141414] netflix-glow bg-zinc-800 relative z-10">
                    <img
                      src={currentDisplayUser.profileImage || dp}
                      alt={currentDisplayUser.firstname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 z-20 px-3 py-1 rounded-full bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                    CREATOR
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-sm transition-all duration-300 netflix-glow-sm transform hover:scale-105 cursor-pointer"
                    >
                      <FaPencilAlt className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectAction}
                      disabled={isConnecting || connectStatus === "Pending"}
                      className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                        connectStatus === "Connect"
                          ? "bg-[#E50914] hover:bg-[#ff1e27] text-white netflix-glow-sm hover:scale-105"
                          : connectStatus === "Disconnect"
                          ? "bg-zinc-800 hover:bg-red-950 text-red-400 border border-zinc-700"
                          : "bg-zinc-800 text-zinc-400 cursor-default"
                      }`}
                    >
                      {connectStatus === "Disconnect" ? (
                        <FaUserCheck className="w-4 h-4" />
                      ) : (
                        <FaUserPlus className="w-4 h-4" />
                      )}
                      <span>
                        {isConnecting ? "Updating..." : connectStatus === "Disconnect" ? "Connected" : connectStatus}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Headline */}
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {currentDisplayUser.firstname} {currentDisplayUser.lastname}
                  </h1>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 font-semibold border border-zinc-700">
                    @{currentDisplayUser.username}
                  </span>
                </div>

                {currentDisplayUser.headline ? (
                  <p className="text-base sm:text-lg text-zinc-300 font-medium max-w-2xl mb-4 leading-relaxed">
                    {currentDisplayUser.headline}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500 italic mb-4">No headline added yet</p>
                )}

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-zinc-400">
                  {currentDisplayUser.location && (
                    <div className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-700/60">
                      <FaMapMarkerAlt className="w-3.5 h-3.5 text-red-500" />
                      <span>{currentDisplayUser.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-700/60">
                    <FaUserCheck className="w-3.5 h-3.5 text-red-500" />
                    <span>
                      <strong className="text-white">
                        {currentDisplayUser.connections?.length || 0}
                      </strong>{" "}
                      Connections
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-700/60">
                    <IoSparkles className="w-3.5 h-3.5 text-red-500" />
                    <span>
                      <strong className="text-white">{userPosts.length}</strong> Posts Published
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tab Switcher */}
            <div className="flex border-t border-zinc-800 bg-zinc-950/60 px-6 sm:px-10">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-4 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "posts"
                    ? "border-[#E50914] text-[#E50914]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Feed Posts ({userPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`py-4 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "experience"
                    ? "border-[#E50914] text-[#E50914]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Experience & Education
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`py-4 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "skills"
                    ? "border-[#E50914] text-[#E50914]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Skills & Talents
              </button>
            </div>
          </div>

          {/* Profile Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Tab Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab 1: Posts */}
              {activeTab === "posts" && (
                <div className="space-y-6">
                  {userPosts.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900 rounded-3xl border border-zinc-800">
                      <IoSparkles className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                      <p className="text-lg font-bold text-zinc-300">No posts shared yet</p>
                      <p className="text-sm text-zinc-500 mt-1">Posts created by this user will appear here.</p>
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <div
                        key={post._id}
                        className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-red-600/40 p-6 shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={currentDisplayUser.profileImage || dp}
                            alt="Avatar"
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                          />
                          <div>
                            <p className="font-bold text-sm text-white">
                              {currentDisplayUser.firstname} {currentDisplayUser.lastname}
                            </p>
                            <span className="text-xs text-zinc-500">
                              {moment(post.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed mb-4 whitespace-pre-line">
                          {post.description}
                        </p>

                        {post.image && (
                          <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-4">
                            <img
                              src={post.image}
                              alt="Post Media"
                              className="w-full max-h-96 object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-400">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <FaHeart className="w-4 h-4 text-red-500" />
                            {post.like?.length || 0} Likes
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold">
                            <FaComment className="w-4 h-4 text-zinc-400" />
                            {post.comments?.length || 0} Comments
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Experience & Education */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  {/* Experience Card */}
                  <div className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500">
                        <FaBriefcase className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Professional Experience</h2>
                    </div>

                    {!currentDisplayUser.experience || currentDisplayUser.experience.length === 0 ? (
                      <p className="text-zinc-500 text-sm">No experience listed yet.</p>
                    ) : (
                      <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                        {currentDisplayUser.experience.map((exp, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#E50914] netflix-glow-sm border-2 border-[#141414]"></div>
                            <h3 className="text-base font-bold text-white">{exp.title}</h3>
                            <p className="text-sm font-semibold text-red-400 mb-1">{exp.company}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education Card */}
                  <div className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500">
                        <FaGraduationCap className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Education & Credentials</h2>
                    </div>

                    {!currentDisplayUser.education || currentDisplayUser.education.length === 0 ? (
                      <p className="text-zinc-500 text-sm">No education listed yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {currentDisplayUser.education.map((edu, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60"
                          >
                            <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                            <p className="text-xs font-semibold text-zinc-400 mt-1">{edu.college}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Skills */}
              {activeTab === "skills" && (
                <div className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500">
                      <IoSparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Core Skills & Expertise</h2>
                  </div>

                  {!currentDisplayUser.skills || currentDisplayUser.skills.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {currentDisplayUser.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-600/20 border border-zinc-700 hover:border-red-600/60 text-sm font-bold text-zinc-200 hover:text-white transition-all cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Col: Quick Overview & Details */}
            <div className="space-y-6">
              {/* Quick Info Box */}
              <div className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-zinc-800">
                  Creator Profile Details
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">
                      Full Name
                    </span>
                    <span className="text-zinc-200 font-bold text-sm">
                      {currentDisplayUser.firstname} {currentDisplayUser.lastname}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">
                      Email Address
                    </span>
                    <span className="text-zinc-300 font-medium">{currentDisplayUser.email}</span>
                  </div>

                  {currentDisplayUser.gender && (
                    <div>
                      <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">
                        Gender
                      </span>
                      <span className="text-zinc-300 font-medium">{currentDisplayUser.gender}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">
                      Joined NetConnect
                    </span>
                    <span className="text-zinc-300 font-medium">
                      {moment(currentDisplayUser.createdAt).format("MMMM YYYY")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connections Spotlight */}
              <div className="animate-section bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                  <h3 className="text-base font-bold text-white">Connections</h3>
                  <Link
                    to="/network"
                    className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                  >
                    View All
                  </Link>
                </div>

                <p className="text-xs text-zinc-400 mb-4">
                  Connected with{" "}
                  <strong className="text-white">
                    {currentDisplayUser.connections?.length || 0}
                  </strong>{" "}
                  industry professionals.
                </p>

                <Link
                  to="/network"
                  className="block w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all"
                >
                  Manage Network
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
