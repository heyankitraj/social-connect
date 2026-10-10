import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { RxCross1 } from "react-icons/rx";
import { FaImage } from "react-icons/fa";
import dp from "../assets/dp.png";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { IoSparkles } from "react-icons/io5";

export default function PostPopUp() {
  const { userData, getPost } = useContext(userDataContext);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [description, setDescription] = useState("");
  const { serverUrl } = useContext(authDataContext);
  const [isPosting, setIsPosting] = useState(false);
  const imageInputRef = useRef();

  useEffect(() => {
    if (popUpOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [popUpOpen]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleUploadPost = async () => {
    if (!description.trim() && !backendImage) return;
    try {
      setIsPosting(true);
      const formData = new FormData();
      formData.append("description", description);
      if (backendImage) formData.append("image", backendImage);

      await axios.post(`${serverUrl}/api/post/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (getPost) await getPost();

      setDescription("");
      setBackendImage(null);
      setFrontendImage("");
      setPopUpOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full mb-6">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={imageInputRef}
        onChange={handleImage}
      />

      {/* Start Post Trigger Card */}
      <div className="w-full bg-zinc-900 rounded-3xl border border-zinc-800 p-5 shadow-2xl hover:border-zinc-700 transition-all">
        <div className="flex gap-4 items-center">
          <img
            src={userData?.profileImage || dp}
            alt="Profile"
            className="w-12 h-12 rounded-2xl border border-zinc-700 object-cover"
          />
          <button
            onClick={() => setPopUpOpen(true)}
            className="flex-1 px-5 py-3 text-left text-zinc-400 bg-black/40 hover:bg-zinc-800/80 border border-zinc-800 rounded-2xl transition-all text-sm font-medium hover:text-white cursor-pointer"
          >
            Share a breakthrough, article, or industry update...
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setPopUpOpen(true);
              setTimeout(() => imageInputRef.current?.click(), 100);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs transition-all cursor-pointer"
          >
            <FaImage className="w-4 h-4 text-red-500" />
            <span>Attach Media</span>
          </button>

          <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5">
            <IoSparkles className="w-3.5 h-3.5 text-red-500" />
            Netflix Creator Stream
          </span>
        </div>
      </div>

      {/* Modal Backdrop & Dialog */}
      {popUpOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setPopUpOpen(false)}
          ></div>

          <div
            className="relative bg-zinc-900 w-full max-w-2xl max-h-[90vh] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-xl border border-zinc-700 object-cover"
                  src={userData?.profileImage || dp}
                  alt="Profile"
                />
                <div>
                  <p className="font-bold text-base text-white">
                    {userData?.firstname} {userData?.lastname}
                  </p>
                  <p className="text-xs text-zinc-400">Post to NetConnect Global Network</p>
                </div>
              </div>
              <button
                onClick={() => setPopUpOpen(false)}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <RxCross1 className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's happening in your tech or creative sphere? Share your insights..."
                className="w-full min-h-[160px] p-4 text-base rounded-2xl bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 resize-none"
              ></textarea>

              {/* Image Preview */}
              {frontendImage && (
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800 group">
                  <img
                    className="w-full max-h-80 object-cover"
                    src={frontendImage}
                    alt="Preview"
                  />
                  <button
                    onClick={() => {
                      setFrontendImage("");
                      setBackendImage(null);
                    }}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all shadow-lg"
                  >
                    <RxCross1 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Attach File Button */}
              <div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <FaImage className="w-4 h-4 text-red-500" />
                  <span>{frontendImage ? "Change Image" : "Add Image / Media"}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">
                {description.length > 0 && `${description.length} characters`}
              </span>

              <button
                onClick={handleUploadPost}
                disabled={(!description.trim() && !backendImage) || isPosting}
                className="px-8 py-3 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-sm shadow-lg netflix-glow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 cursor-pointer"
              >
                {isPosting ? "Broadcasting..." : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
