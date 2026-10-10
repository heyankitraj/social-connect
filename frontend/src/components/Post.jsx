import { useContext, useState, useEffect } from "react";
import dp from "../assets/dp.png";
import moment from "moment";
import { FaHeart, FaRegHeart, FaRegComment, FaTrash, FaPaperPlane } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const { _id, image, author, comments, like, description, createdAt } = post;

  const { serverUrl } = useContext(authDataContext);
  const { userData, postData, setPostData, getPost } = useContext(userDataContext);

  const isCurrentUserAuthor = author?._id?.toString() === userData?._id?.toString();
  const userHasLiked = like?.some(
    (id) => (id?._id || id)?.toString() === userData?._id?.toString()
  );

  const [readMore, setReadMore] = useState(false);
  const [likeCount, setLikeCount] = useState(like?.length || 0);
  const [isLiked, setIsLiked] = useState(userHasLiked || false);
  const [commentContent, setCommentContent] = useState("");
  const [commentList, setCommentList] = useState(comments || []);
  const [showComments, setShowComments] = useState(false);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsLiked(userHasLiked || false);
    setLikeCount(like?.length || 0);
    setCommentList(comments || []);
  }, [post, userData]);

  useEffect(() => {
    if (!isCurrentUserAuthor && author?._id) {
      axios
        .get(`${serverUrl}/api/connection/getstatus/${author._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data?.status) {
            setConnectStatus(res.data.status);
          }
        })
        .catch((err) => console.log("Connection status error:", err));
    }
  }, [author?._id, isCurrentUserAuthor, serverUrl]);

  const handleConnect = async () => {
    if (!author?._id || isConnecting || connectStatus !== "Connect") return;
    try {
      setIsConnecting(true);
      await axios.post(
        `${serverUrl}/api/connection/send/${author._id}`,
        {},
        { withCredentials: true }
      );
      setConnectStatus("Pending");
    } catch (error) {
      console.log("Connect error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${_id}`, {
        withCredentials: true,
      });

      setLikeCount(result.data.like.length);
      setIsLiked(!isLiked);

      if (postData && setPostData) {
        const updatedPosts = postData.map((p) => (p._id === _id ? result.data : p));
        setPostData(updatedPosts);
      }
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${_id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      setCommentList(result.data.comments);
      setCommentContent("");
    } catch (error) {
      console.log("Comment error:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${serverUrl}/api/post/${_id}`, { withCredentials: true });
      if (getPost) await getPost();
    } catch (error) {
      console.error("Delete post error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-red-600/40 shadow-2xl overflow-hidden transition-all duration-300 mb-6">
      {/* Post Header */}
      <div className="flex items-start justify-between p-6">
        <div className="flex gap-3.5">
          <Link to={`/profile/${author?._id}`} className="relative flex-shrink-0">
            <img
              src={author?.profileImage || dp}
              alt="Profile"
              className="w-12 h-12 rounded-2xl border border-zinc-700 object-cover"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${author?._id}`}
              className="font-bold text-sm text-white hover:text-[#E50914] transition-colors block"
            >
              {author?.firstname} {author?.lastname}
            </Link>
            <p className="text-xs text-zinc-400 line-clamp-1">{author?.headline || "NetConnect Creator"}</p>
            <span className="text-[11px] text-zinc-500">{moment(createdAt).fromNow()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentUserAuthor && (
            <button
              onClick={handleConnect}
              disabled={connectStatus !== "Connect" || isConnecting}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                connectStatus === "Connect"
                  ? "bg-[#E50914] hover:bg-[#ff1e27] text-white netflix-glow-sm cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-default"
              }`}
            >
              {isConnecting ? "..." : connectStatus === "Disconnect" ? "Connected" : connectStatus}
            </button>
          )}

          {isCurrentUserAuthor && (
            <button
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-950/60 text-zinc-500 hover:text-red-500 border border-zinc-700 transition-colors cursor-pointer"
              title="Delete post"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
        <p
          className={`text-sm text-zinc-300 leading-relaxed whitespace-pre-line ${
            !readMore && description?.length > 200 ? "line-clamp-3" : ""
          }`}
        >
          {description}
        </p>
        {description?.length > 200 && (
          <button
            onClick={() => setReadMore(!readMore)}
            className="text-xs font-bold text-red-500 hover:text-red-400 mt-2 cursor-pointer"
          >
            {readMore ? "Show less" : "...read full story"}
          </button>
        )}
      </div>

      {/* Media Image */}
      {image && (
        <div className="px-6 pb-4">
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black/40">
            <img src={image} alt="Post content" className="w-full max-h-[500px] object-cover" />
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="px-6 py-3 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 bg-zinc-950/40">
        <span className="flex items-center gap-1.5 font-bold">
          <FaHeart className={`w-3.5 h-3.5 ${likeCount > 0 ? "text-red-500" : "text-zinc-600"}`} />
          <span>{likeCount} reactions</span>
        </span>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-white transition-colors cursor-pointer font-bold"
        >
          {commentList?.length || 0} comments
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-2.5 flex gap-3 border-t border-zinc-800/80 bg-zinc-900">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            isLiked
              ? "bg-red-600/10 text-[#E50914] border border-red-600/30"
              : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          {isLiked ? <FaHeart className="w-4 h-4 text-[#E50914]" /> : <FaRegHeart className="w-4 h-4" />}
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            showComments
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          <FaRegComment className="w-4 h-4" />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="flex gap-3 items-center">
            <img
              src={userData?.profileImage || dp}
              alt="You"
              className="w-9 h-9 rounded-xl object-cover border border-zinc-700"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Write a thoughtful comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-600"
              />
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#E50914] text-white disabled:opacity-40 transition-all cursor-pointer"
              >
                <FaPaperPlane className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {commentList && commentList.length > 0 && (
            <div className="space-y-3 pt-2">
              {commentList.map((c, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <Link to={`/profile/${c.author?._id}`}>
                    <img
                      src={c.author?.profileImage || dp}
                      alt={c.author?.firstname}
                      className="w-8 h-8 rounded-lg object-cover border border-zinc-800 flex-shrink-0"
                    />
                  </Link>
                  <div className="flex-1 bg-zinc-900 rounded-2xl p-3 border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        to={`/profile/${c.author?._id}`}
                        className="font-bold text-xs text-white hover:text-red-500 transition-colors"
                      >
                        {c.author?.firstname} {c.author?.lastname}
                      </Link>
                      <span className="text-[10px] text-zinc-500">
                        {moment(c.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-snug">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
