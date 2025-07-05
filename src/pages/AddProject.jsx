import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import AdminAuthWrapper from "../components/AdminAuthWrapper";

const LOCAL_STORAGE_KEY = "add-project-form";

const AddProject = () => {
  const { addProject } = useOutletContext();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    area: "",
    year: "",
    location: "",
    category: "",
    customCategory: "",
    type: "",
    description: "",
    client: "",
    size: "",
    projectDates: {
      design: "",
      fabrication: "",
      opening: ""
    },
    servicesProvided: "",
    designTeam: "",
    projectType: "",
    useType: ""
  });

  const [cimg, setCimg] = useState(null);
  const [interiorFiles, setInteriorFiles] = useState([]);
  const [exteriorFiles, setExteriorFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", success: true });

  // Restore form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || formData);
      setCimg(parsed.cimg || null);
      setInteriorFiles(parsed.interiorFiles || []);
      setExteriorFiles(parsed.exteriorFiles || []);
    }
    // eslint-disable-next-line
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ formData, cimg, interiorFiles, exteriorFiles })
    );
  }, [formData, cimg, interiorFiles, exteriorFiles]);

  // Accepts a progress callback for real upload progress
  const uploadToImageKit = async (file, onProgress) => {
    const auth = await axios.get("/api/auth");
    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY); // Updated
    form.append("signature", auth.data.signature);
    form.append("expire", auth.data.expire);
    form.append("token", auth.data.token);

    const res = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      form,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);

    const totalFiles =
      (cimg ? 1 : 0) + interiorFiles.length + exteriorFiles.length;
    let uploaded = 0;

    // Helper to update progress bar based on all files
    const updateOverallProgress = (filePercent) => {
      // filePercent: 0-100 for current file
      // uploaded: number of files already uploaded
      // totalFiles: total number of files
      // Progress = (uploaded + filePercent/100) / totalFiles * 100
      setProgress(
        Math.round(((uploaded + filePercent / 100) / totalFiles) * 100)
      );
    };

    try {
      // Upload cover image
      let cimgURL = "";
      if (cimg) {
        cimgURL = await uploadToImageKit(cimg, (percent) => updateOverallProgress(percent));
        uploaded++;
        setProgress(Math.round((uploaded / totalFiles) * 100));
      }

      // Upload interior images
      const interiorURLs = [];
      for (const file of interiorFiles) {
        interiorURLs.push(
          await uploadToImageKit(file, (percent) => updateOverallProgress(percent))
        );
        uploaded++;
        setProgress(Math.round((uploaded / totalFiles) * 100));
      }

      // Upload exterior images
      const exteriorURLs = [];
      for (const file of exteriorFiles) {
        exteriorURLs.push(
          await uploadToImageKit(file, (percent) => updateOverallProgress(percent))
        );
        uploaded++;
        setProgress(Math.round((uploaded / totalFiles) * 100));
      }

      setProgress(100);

      const data = {
        ...formData,
        id: Date.now(),
        year: Number(formData.year),
        cimg: cimgURL,
        interiorImages: interiorURLs,
        exteriorImages: exteriorURLs,
      };

      await addProject(data);

      setNotification({
        show: true,
        message: "Project added successfully!",
        success: true,
      });

      localStorage.removeItem(LOCAL_STORAGE_KEY);

      setFormData({
        id: "",
        title: "",
        area: "",
        year: "",
        location: "",
        category: "",
        customCategory: "",
        type: "",
        description: "",
        client: "",
        size: "",
        projectDates: {
          design: "",
          fabrication: "",
          opening: ""
        },
        servicesProvided: "",
        designTeam: "",
        projectType: "",
        useType: ""
      });
      setCimg(null);
      setInteriorFiles([]);
      setExteriorFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
      setNotification({
        show: true,
        message: "Error uploading project",
        success: false,
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(0);
      }, 700);
      setTimeout(() => {
        setNotification((n) => ({ ...n, show: false }));
      }, 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AdminAuthWrapper>
      <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center !p-0 !mt-0">
        {/* Notification */}
        {notification.show && (
          <div
            className={`
              fixed top-6 right-6 z-50
              transition-all duration-700
              ${notification.show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
              ${notification.success ? "bg-green-500" : "bg-red-500"}
              text-white !px-6 !py-3 rounded-lg shadow-lg flex items-center gap-2
            `}
            style={{ minWidth: 260 }}
          >
            {notification.success ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl mx-auto bg-white flex flex-col justify-center space-y-10 !px-4 sm:!px-8 md:!px-16 !py-8 md:!py-12"
          style={{ minHeight: "100vh" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-black !mb-10">
            Add New Project
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {["title", "client", "area", "size", "year", "location", "type"].map((field) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="!mb-1 font-bold text-black text-lg md:text-xl">
                  {field === "client" ? "Client" : 
                   field === "size" ? "Size (m²)" :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "year" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
                />
              </div>
            ))}

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
              >
                <option value="">Select Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Public Institution">Public Institution</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Custom Category Input - Only show if "Other" is selected */}
            {formData.category === "Other" && (
              <div className="flex flex-col gap-2">
                <label className="!mb-1 font-bold text-black text-lg md:text-xl">Custom Category</label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory || ""}
                  onChange={handleChange}
                  placeholder="Enter custom category"
                  required
                  className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
                />
              </div>
            )}

            {/* Project Dates */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="!mb-1 font-bold text-black text-lg md:text-xl">Design Date</label>
                <input
                  type="text"
                  name="designDate"
                  value={formData.projectDates.design}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    projectDates: { ...prev.projectDates, design: e.target.value }
                  }))}
                  placeholder="e.g., April 2019 - May 2020"
                  className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="!mb-1 font-bold text-black text-lg md:text-xl">Fabrication & Installation</label>
                <input
                  type="text"
                  name="fabricationDate"
                  value={formData.projectDates.fabrication}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    projectDates: { ...prev.projectDates, fabrication: e.target.value }
                  }))}
                  placeholder="e.g., June 2020 - August 2020"
                  className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="!mb-1 font-bold text-black text-lg md:text-xl">Opening Date</label>
                <input
                  type="text"
                  name="openingDate"
                  value={formData.projectDates.opening}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    projectDates: { ...prev.projectDates, opening: e.target.value }
                  }))}
                  placeholder="e.g., September 2020"
                  className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
                />
              </div>
            </div>

            {/* Services Provided */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Services Provided</label>
              <textarea
                name="servicesProvided"
                value={formData.servicesProvided}
                onChange={handleChange}
                placeholder="e.g., Architectural Installation Concept and Developed Design (RIBA St 2-4a)"
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg focus:border-black focus:ring-2 focus:ring-black/10"
                rows={3}
              />
            </div>

            {/* Design Team */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Design Team</label>
              <textarea
                name="designTeam"
                value={formData.designTeam}
                onChange={handleChange}
                placeholder="e.g., Tom Massey (Horticulture), Cake Industries (Fabrication)"
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg focus:border-black focus:ring-2 focus:ring-black/10"
                rows={3}
              />
            </div>

            {/* Project Type and Use Type */}
            <div className="flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Project Type</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
              >
                <option value="">Select Project Type</option>
                <option value="Object & Sculpture">Object & Sculpture</option>
                <option value="Architecture">Architecture</option>
                <option value="Interior Design">Interior Design</option>
                <option value="Landscape">Landscape</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Use Type</label>
              <input
                type="text"
                name="useType"
                value={formData.useType}
                onChange={handleChange}
                placeholder="e.g., Health & Wellbeing, Leisure & Recreation"
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="!mb-1 font-bold text-black text-lg md:text-xl">Description/Story</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="!px-4 !py-3 md:!px-6 md:!py-4 border border-gray-300 rounded-lg text-black w-full bg-white text-base md:text-lg focus:border-black focus:ring-2 focus:ring-black/10"
                rows={5}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <label className="!mb-1 font-bold text-black text-lg md:text-xl">Cover Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <input
                id="cover-img"
                type="file"
                accept="image/*"
                onChange={(e) => setCimg(e.target.files[0])}
                required
                className="hidden"
              />
              <label
                htmlFor="cover-img"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black !px-6 !py-3 rounded-lg shadow font-medium transition"
                title="Upload Cover Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload Cover Image
              </label>
              <span className="text-gray-600 text-base md:text-lg">
                {cimg ? cimg.name : "No file chosen"}
              </span>
              {cimg && (
                <img
                  src={URL.createObjectURL(cimg)}
                  alt="Cover Preview"
                  className="w-32 h-20 md:w-44 md:h-28 object-cover rounded border !ml-2"
                />
              )}
            </div>
          </div>

          {/* Interior Images */}
          <div className="flex flex-col gap-2">
            <label className="!mb-1 font-bold text-black text-lg md:text-xl">Interior Images</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <input
                id="interior-imgs"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setInteriorFiles(Array.from(e.target.files))}
                required
                className="hidden"
              />
              <label
                htmlFor="interior-imgs"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black !px-6 !py-3 rounded-lg shadow font-medium transition"
                title="Upload Interior Images"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload Interior Images
              </label>
              <span className="text-gray-600 text-base md:text-lg">
                {interiorFiles.length > 0
                  ? `${interiorFiles.length} file${interiorFiles.length > 1 ? "s" : ""} selected`
                  : "No files chosen"}
              </span>
              <div className="flex flex-wrap gap-3 !mt-2">
                {interiorFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Interior ${idx + 1}`}
                    className="w-16 h-12 md:w-24 md:h-18 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Exterior Images */}
          <div className="flex flex-col gap-2">
            <label className="!mb-1 font-bold text-black text-lg md:text-xl">Exterior Images</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <input
                id="exterior-imgs"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setExteriorFiles(Array.from(e.target.files))}
                required
                className="hidden"
              />
              <label
                htmlFor="exterior-imgs"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black !px-6 !py-3 rounded-lg shadow font-medium transition"
                title="Upload Exterior Images"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload Exterior Images
              </label>
              <span className="text-gray-600 text-base md:text-lg">
                {exteriorFiles.length > 0
                  ? `${exteriorFiles.length} file${exteriorFiles.length > 1 ? "s" : ""} selected`
                  : "No files chosen"}
              </span>
              <div className="flex flex-wrap gap-3 !mt-2">
                {exteriorFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Exterior ${idx + 1}`}
                    className="w-16 h-12 md:w-24 md:h-18 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          </div>

          {isSubmitting && (
            <div className="w-full mb-4">
              <div className="flex items-center mb-1">
                <span className="text-lg text-gray-700 font-semibold">Uploading...</span>
                <span className="ml-auto text-base text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-auto !p-4 !mt-8 bg-black text-white cursor-pointer rounded-xl hover:bg-gray-500 text-xl md:text-2xl font-bold transition"
          >
            {isSubmitting ? "Uploading..." : "Submit Project"}
          </button>
        </form>
      </div>
    </AdminAuthWrapper>
  );
};

export default AddProject;
