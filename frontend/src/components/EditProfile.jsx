import { useContext, useState, useRef, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaCamera, FaBriefcase, FaGraduationCap, FaPlus, FaTrash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext";
import dp from "../assets/dp.png";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { IoSparkles } from "react-icons/io5";

export default function EditProfile() {
  const { userData, setUserData, setIsEditing } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'experience' | 'education' | 'skills'

  // General fields
  const [firstname, setFirstname] = useState(userData?.firstname || "");
  const [lastname, setLastname] = useState(userData?.lastname || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [headline, setHeadline] = useState(userData?.headline || "");
  const [gender, setGender] = useState(userData?.gender || "");
  const [location, setLocation] = useState(userData?.location || "");

  // Skills
  const [skills, setSkills] = useState(userData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Education
  const [education, setEducation] = useState(userData?.education || []);
  const [newEducation, setNewEducation] = useState({ college: "", degree: "" });

  // Experience
  const [experience, setExperience] = useState(userData?.experience || []);
  const [newExperience, setNewExperience] = useState({ title: "", company: "", description: "" });

  // Media
  const [frontendProfileImage, setFrontendProfileImage] = useState(userData?.profileImage || dp);
  const [backendProfileImage, setBackendProfileImage] = useState(null);
  const [frontendCoverImage, setFrontendCoverImage] = useState(userData?.coverImage || "");
  const [backendCoverImage, setBackendCoverImage] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const profileInputRef = useRef();
  const coverInputRef = useRef();

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendProfileImage(file);
      setFrontendProfileImage(URL.createObjectURL(file));
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendCoverImage(file);
      setFrontendCoverImage(URL.createObjectURL(file));
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addEducation = (e) => {
    e.preventDefault();
    if (newEducation.college.trim() && newEducation.degree.trim()) {
      setEducation([...education, { ...newEducation }]);
      setNewEducation({ college: "", degree: "" });
    }
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = (e) => {
    e.preventDefault();
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setExperience([...experience, { ...newExperience }]);
      setNewExperience({ title: "", company: "", description: "" });
    }
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("headline", headline);
      formData.append("gender", gender);
      formData.append("location", location);
      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(education));
      formData.append("experience", JSON.stringify(experience));

      if (backendProfileImage) formData.append("profileImage", backendProfileImage);
      if (backendCoverImage) formData.append("coverImage", backendCoverImage);

      const result = await axios.put(`${serverUrl}/api/user/updateprofile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserData(result.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Save profile error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-center items-center p-4">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => setIsEditing(false)}
      ></div>

      {/* Modal Dialog */}
      <div
        className="relative bg-zinc-900 w-full max-w-3xl max-h-[92vh] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-black text-sm">
              N
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">Edit Creator Profile</h2>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <RxCross1 className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-6 gap-2">
          {["general", "experience", "education", "skills"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-[#E50914] text-[#E50914]"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Hidden file inputs */}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={profileInputRef}
            onChange={handleProfileImage}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={coverInputRef}
            onChange={handleCoverImage}
          />

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Media Uploaders */}
              <div className="space-y-4">
                {/* Cover Banner */}
                <div
                  onClick={() => coverInputRef.current.click()}
                  className="relative h-32 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer group"
                >
                  {frontendCoverImage ? (
                    <img
                      src={frontendCoverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold">
                      Click to upload banner photo
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-2 text-xs font-bold">
                    <FaCamera className="w-4 h-4 text-red-500" />
                    <span>Change Cover</span>
                  </div>
                </div>

                {/* Avatar Uploader */}
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => profileInputRef.current.click()}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-700 cursor-pointer group flex-shrink-0"
                  >
                    <img
                      src={frontendProfileImage}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <FaCamera className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Profile Photo</p>
                    <p className="text-xs text-zinc-500">Square PNG or JPG recommended</p>
                  </div>
                </div>
              </div>

              {/* Text inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Software Engineer at Netflix | Full Stack Specialist"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-red-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              {/* Add Experience Form */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Add Experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      placeholder="Role description and achievements..."
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs resize-none h-20"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-[#E50914] text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* List */}
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{exp.title}</h4>
                      <p className="text-xs text-red-400 font-semibold">{exp.company}</p>
                      <p className="text-xs text-zinc-400 mt-1">{exp.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-zinc-500 hover:text-red-500 p-2"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Add Education</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Degree (e.g. B.Tech Computer Science)"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="College / University"
                    value={newEducation.college}
                    onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-[#E50914] text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{edu.degree}</h4>
                      <p className="text-xs text-zinc-400">{edu.college}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-zinc-500 hover:text-red-500 p-2"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <form onSubmit={addSkill} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter a skill (e.g. React, Node.js, Cloud)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white text-xs font-bold transition-all"
                >
                  Add Skill
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-zinc-500 hover:text-red-500"
                    >
                      <RxCross1 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-xs shadow-lg netflix-glow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
