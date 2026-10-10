import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoSparkles } from "react-icons/io5";

export const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext);
  const { setUserData } = useContext(userDataContext);

  const handleSignin = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate("/");
      setIsLoading(false);
      setEmail("");
      setPassword("");
      setErrors("");
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      } else {
        setErrors("Login failed. Check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Cinematic Red Ambient Glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-red-600/15 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Background Vignette Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Monogram */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-[#E50914] rounded-2xl flex items-center justify-center font-black text-white text-2xl tracking-tighter shadow-2xl netflix-glow">
            N
          </div>
          <span className="font-black tracking-tighter text-2xl text-white">
            NET<span className="text-[#E50914]">CONNECT</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-800 p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight">Sign In</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Welcome back to your global professional network.
            </p>
          </div>

          {errors && (
            <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
              <FaExclamationCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errors}</span>
            </div>
          )}

          <form onSubmit={handleSignin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-black text-sm tracking-wide shadow-xl netflix-glow-sm hover:scale-[101%] transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Authenticating..." : "Sign In to NetConnect"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              New to NetConnect?{" "}
              <Link to="/signup" className="font-bold text-white hover:text-red-500 transition-colors">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
