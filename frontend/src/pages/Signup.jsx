import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

export const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { serverUrl } = useContext(authDataContext);
  const { setUserData } = useContext(userDataContext);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!firstname.trim() || !username.trim()) {
      setErrors("Please enter your name and username.");
      return;
    }
    setErrors("");
    setCurrentStep(2);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          firstname,
          lastname,
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      setIsLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      } else {
        setErrors("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Cinematic Red Ambient Glow */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-red-600/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-red-600/15 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Monogram Logo */}
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
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                Step {currentStep} of 2
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {currentStep === 1
                ? "Let's start with your identity and handle."
                : "Secure your account with credentials."}
            </p>
          </div>

          {errors && (
            <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
              <FaExclamationCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errors}</span>
            </div>
          )}

          {currentStep === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-black text-sm tracking-wide shadow-xl netflix-glow-sm hover:scale-[101%] transition-all duration-300 cursor-pointer"
              >
                Continue to Next Step
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
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
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
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
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showConfirmPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-black text-sm shadow-xl netflix-glow-sm disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isLoading ? "Creating Account..." : "Complete & Join"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white hover:text-red-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
