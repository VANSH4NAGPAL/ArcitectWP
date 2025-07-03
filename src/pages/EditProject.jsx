import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import AdminAuthWrapper from "../components/AdminAuthWrapper";

const EditProject = () => {
  const { docId } = useParams();
  const { projects, updateProject } = useOutletContext();
  const navigate = useNavigate();
  const project = projects.find((p) => p.docId === docId);

  // Form state
  const [formData, setFormData] = useState(null);
  const [cimg, setCimg] = useState(null);
  const [interiorFiles, setInteriorFiles] = useState([]);
  const [exteriorFiles, setExteriorFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", success: true });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        year: project.year || "",
      });
      setCimg(null);
      setInteriorFiles([]);
      setExteriorFiles([]);
    }
  }, [project]);

  // Helper: upload to ImageKit (same as AddProject)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);

    try {
      let cimgURL = formData.cimg;
      let interiorURLs = formData.interiorImages || [];
      let exteriorURLs = formData.exteriorImages || [];

      // Count how many files to upload
      const totalFiles =
        (cimg ? 1 : 0) + interiorFiles.length + exteriorFiles.length;
      let uploaded = 0;

      const updateOverallProgress = (filePercent) => {
        setProgress(
          totalFiles === 0
            ? 100
            : Math.round(((uploaded + filePercent / 100) / totalFiles) * 100)
        );
      };

      // Cover image
      if (cimg) {
        cimgURL = await uploadToImageKit(cimg, (percent) => updateOverallProgress(percent));
        uploaded++;
        setProgress(Math.round((uploaded / totalFiles) * 100));
      }

      // Interior images
      if (interiorFiles.length > 0) {
        interiorURLs = [];
        for (const file of interiorFiles) {
          interiorURLs.push(
            await uploadToImageKit(file, (percent) => updateOverallProgress(percent))
          );
          uploaded++;
          setProgress(Math.round((uploaded / totalFiles) * 100));
        }
      }

      // Exterior images
      if (exteriorFiles.length > 0) {
        exteriorURLs = [];
        for (const file of exteriorFiles) {
          exteriorURLs.push(
            await uploadToImageKit(file, (percent) => updateOverallProgress(percent))
          );
          uploaded++;
          setProgress(Math.round((uploaded / totalFiles) * 100));
        }
      }

      setProgress(100);

      // Prepare update data
      const data = {
        ...formData,
        year: Number(formData.year),
        cimg: cimgURL,
        interiorImages: interiorURLs,
        exteriorImages: exteriorURLs,
      };

      await updateProject(docId, data);

      setNotification({
        show: true,
        message: "Project updated successfully!",
        success: true,
      });

      setTimeout(() => {
        navigate("/headinfo/list", { state: { toast: "Project updated successfully!" } });
      }, 1200);
    } catch (err) {
      setNotification({
        show: true,
        message: "Error updating project",
        success: false,
      });
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleRemoveInteriorImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      interiorImages: prev.interiorImages.filter((_, i) => i !== idx),
    }));
  };
  const handleRemoveExteriorImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      exteriorImages: prev.exteriorImages.filter((_, i) => i !== idx),
    }));
  };
  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      cimg: "",
    }));
    setCimg(null);
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 !px-4">
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
          className="bg-white !p-8 rounded-xl shadow-xl w-full max-w-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-black !mb-2">
            Edit Project
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["title", "area", "year", "location", "category", "type"].map((field) => (
              <div key={field}>
                <label className="!mb-1 font-medium text-black">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "year" ? "number" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required
                  className="!px-4 !py-2 border border-gray-300 rounded-md text-black w-full"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="!mb-1 font-medium text-black">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                className="!px-4 !py-2 border border-gray-300 rounded-md text-black w-full"
                rows={3}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="flex flex-col">
            <label className="!mb-1 font-medium text-black">Cover Image</label>
            <div className="flex items-center gap-4">
              <input
                id="cover-img"
                type="file"
                accept="image/*"
                onChange={(e) => setCimg(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="cover-img"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black px-4 py-2 rounded shadow-sm font-medium transition"
                title="Upload Cover Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                {cimg ? "Change Cover Image" : "Upload Cover Image"}
              </label>
              <span className="text-gray-600 text-sm">
                {cimg ? cimg.name : "Current image"}
              </span>
              { (cimg || formData.cimg) && (
                <div className="relative">
                  <img
                    src={cimg ? URL.createObjectURL(cimg) : formData.cimg}
                    alt="Cover Preview"
                    className="w-32 h-20 object-cover rounded border ml-2"
                  />
                  {formData.cimg && !cimg && (
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      title="Remove Cover Image"
                    >×</button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interior Images */}
          <div className="flex flex-col">
            <label className="!mb-1 font-medium text-black">Interior Images</label>
            <div className="flex items-center gap-4">
              <input
                id="interior-imgs"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setInteriorFiles(Array.from(e.target.files))}
                className="hidden"
              />
              <label
                htmlFor="interior-imgs"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black px-4 py-2 rounded shadow-sm font-medium transition"
                title="Upload Interior Images"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                {interiorFiles.length > 0 ? "Change Interior Images" : "Upload Interior Images"}
              </label>
              <span className="text-gray-600 text-sm">
                {interiorFiles.length > 0
                  ? `${interiorFiles.length} file${interiorFiles.length > 1 ? "s" : ""} selected`
                  : "Current images"}
              </span>
              <div className="flex flex-wrap gap-2 !mt-2">
                {interiorFiles.length > 0
                  ? interiorFiles.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`Interior ${idx + 1}`}
                        className="w-16 h-12 object-cover rounded border"
                      />
                    ))
                  : (formData.interiorImages || []).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Interior ${idx + 1}`}
                          className="w-16 h-12 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveInteriorImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >×</button>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Exterior Images */}
          <div className="flex flex-col">
            <label className="!mb-1 font-medium text-black">Exterior Images</label>
            <div className="flex items-center gap-4">
              <input
                id="exterior-imgs"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setExteriorFiles(Array.from(e.target.files))}
                className="hidden"
              />
              <label
                htmlFor="exterior-imgs"
                className="cursor-pointer flex items-center gap-2 bg-white border border-gray-400 hover:bg-gray-100 text-black px-4 py-2 rounded shadow-sm font-medium transition"
                title="Upload Exterior Images"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                {exteriorFiles.length > 0 ? "Change Exterior Images" : "Upload Exterior Images"}
              </label>
              <span className="text-gray-600 text-sm">
                {exteriorFiles.length > 0
                  ? `${exteriorFiles.length} file${exteriorFiles.length > 1 ? "s" : ""} selected`
                  : "Current images"}
              </span>
              <div className="flex flex-wrap gap-2 !mt-2">
                {exteriorFiles.length > 0
                  ? exteriorFiles.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`Exterior ${idx + 1}`}
                        className="w-16 h-12 object-cover rounded border"
                      />
                    ))
                  : (formData.exteriorImages || []).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Exterior ${idx + 1}`}
                          className="w-16 h-12 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExteriorImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >×</button>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {isSubmitting && (
            <div className="w-full mb-4">
              <div className="flex items-center mb-1">
                <span className="text-sm text-gray-700 font-medium">Uploading...</span>
                <span className="ml-auto text-xs text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-auto !p-2 !mt-6 bg-black text-white cursor-pointer !py-2 rounded-lg hover:bg-gray-800 text-lg font-semibold"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminAuthWrapper>
  );
};

export default EditProject;