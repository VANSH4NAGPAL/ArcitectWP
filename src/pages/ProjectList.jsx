import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AdminAuthWrapper from "../components/AdminAuthWrapper";

const ProjectList = () => {
  const { projects, deleteProject } = useOutletContext();
  const [showPrompt, setShowPrompt] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);

  const handleDeleteClick = (proj) => {
    setToDelete(proj);
    setShowPrompt(true);
  };

  const confirmDelete = async () => {
    if (toDelete) {
      try {
        setIsDeleting(true);
        await deleteProject(toDelete.docId); // Use context function
        setIsDeleting(false);
        setShowPrompt(false);
        setToDelete(null);
      } catch (err) {
        setIsDeleting(false);
        setShowPrompt(false);
        setToDelete(null);
        setError(true);

        // Auto-hide after 4 seconds
        setTimeout(() => {
          setError(false);
        }, 4000);
      }
    }
  };

  return (
    <AdminAuthWrapper>
      <div className="space-y-6 !p-6">
        <div className="flex justify-between items-center !mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Link
            to="/headinfo/add"
            className="bg-black text-white !px-4 !py-2 rounded hover:bg-gray-800"
          >
            + Add New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.docId} className="bg-white p-4 rounded shadow !p-2">
              <img
                src={proj.cimg}
                alt={proj.title}
                className="w-full h-40 object-cover rounded !mb-2"
              />
              <h3 className="font-semibold text-lg text-black !p-2">{proj.title}</h3>
              <Link
                to={`/headinfo/edit/${proj.docId}`}
                className="!mt-2 text-blue-600 hover:underline !ml-2 !mr-2"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDeleteClick(proj)}
                className=" !mt-2 text-red-600 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Prompt */}
        {showPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center !space-y-4">
              <p>
                Are you sure you want to delete the project{" "}
                <b>{toDelete?.title}</b>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white !px-4 !py-2 rounded"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="bg-gray-300 !px-4 !py-2 rounded"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-in Error Notification */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in z-50">
            ❌ Project could not be deleted.
          </div>
        )}
      </div>
    </AdminAuthWrapper>
  );
};

export default ProjectList;
