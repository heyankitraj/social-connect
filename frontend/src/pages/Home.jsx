import { Header } from "../components/Header";
import EditProfile from "../components/EditProfile";
import { useContext, useEffect, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import HomeLeftSection from "../components/HomeLeftSection";
import HomeRightSection from "../components/HomeRightSection";
import PostPopUp from "../components/PostPopUp";
import Post from "../components/Post";
import gsap from "gsap";

export default function Home() {
  const { isEditing, postData } = useContext(userDataContext);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current && postData.length > 0) {
      gsap.fromTo(
        feedRef.current.querySelectorAll(".feed-item"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [postData.length]);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {isEditing && <EditProfile />}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Profile Mini-Card */}
          <HomeLeftSection />

          {/* Middle Main Feed */}
          <div className="w-full lg:flex-1 min-w-0" ref={feedRef}>
            <PostPopUp />

            {postData.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800">
                <p className="text-lg font-bold text-zinc-300">No posts in the stream</p>
                <p className="text-xs text-zinc-500 mt-1">Be the first creator to broadcast to NetConnect!</p>
              </div>
            ) : (
              postData.map((post) => (
                <div key={post._id} className="feed-item">
                  <Post post={post} />
                </div>
              ))
            )}
          </div>

          {/* Right News & Suggestions Sidebar */}
          <HomeRightSection />
        </div>
      </main>
    </div>
  );
}
