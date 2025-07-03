import React, { useEffect, useState, useCallback } from "react";
import AdminAuthWrapper from "../components/AdminAuthWrapper";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { db, analytics } from "../firebase";
import { collection, getDocs, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

const navLinks = [
  { to: "/headinfo", label: "Dashboard", icon: "🏠" },
  { to: "/headinfo/add", label: "Add Project", icon: "➕" },
  { to: "/headinfo/list", label: "View Projects", icon: "📋" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Simple logout: remove admin token and redirect (adjust as per your auth logic)
  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth"); // Use sessionStorage
    navigate("/headinfo", { replace: true }); // Redirect to login page, replace history
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      setProjects(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Add project
  const addProject = useCallback(async (data) => {
    await addDoc(collection(db, "projects"), data);
  }, []);

  // Delete project
  const deleteProject = useCallback(async (docId) => {
    await deleteDoc(doc(db, "projects", docId));
  }, []);

  // Update project
  const updateProject = useCallback(async (docId, data) => {
    await updateDoc(doc(db, "projects", docId), data);
  }, []);

  // Use projects.length for projectCount
  const projectCount = projects.length;

  // Pass state and actions to children via context or props
  return (
    <AdminAuthWrapper>
      <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-black text-white shadow-lg !py-8 !px-6">
          <div className="!mb-10 flex items-center gap-2">
            <span className="text-3xl font-bold tracking-tight">Admin</span>
            <span className="text-xs bg-white text-black !px-2 !py-1 rounded-full font-semibold">
              DASHBOARD
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 !px-4 !py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-white text-black font-bold shadow"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="!mt-8 !px-4 !py-2 rounded-lg bg-white text-black font-semibold hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            Logout
          </button>
          <div className="!mt-auto !pt-10 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ArchitectWP Admin
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="md:hidden flex items-center justify-between bg-black text-white !px-4 !py-4 shadow">
            <span className="text-xl font-semibold">Admin Dashboard</span>
            <nav className="flex gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`!px-3 !py-1 rounded ${
                    location.pathname === link.to
                      ? "bg-white text-black font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="!ml-2 !px-3 !py-1 rounded bg-white text-black font-bold hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                Logout
              </button>
            </nav>
          </header>
          {/* Dashboard Header */}
          <div className="w-full bg-white shadow-md !px-8 !py-6 flex flex-col md:flex-row md:items-center md:justify-between border-b">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 !mb-1">
                Welcome, Admin
              </h1>
              <p className="text-gray-500 text-sm">
                Manage your projects and content from this dashboard.
              </p>
            </div>
            <div className="flex gap-4 !mt-4 md:!mt-0 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-2 !px-4 !py-2 rounded-lg border transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="!ml-2 !px-4 !py-2 rounded-lg bg-black text-white border border-black hover:bg-red-500 hover:border-red-500 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Analytics Cards */}
          <div className="w-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 !py-6 !px-4 md:!px-10 flex flex-wrap gap-6 justify-center items-center">
            <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow-lg !p-6 flex flex-col items-center border border-gray-100">
              <span className="text-5xl font-extrabold text-green-600 !mb-3">●</span>
              <span className="text-xl font-bold text-gray-700 mb-2">
                Analytics Active
              </span>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow-lg !p-6 flex flex-col items-center border border-gray-100">
              <span className="text-5xl font-extrabold text-blue-600 !mb-3">
                {projectCount}
              </span>
              <span className="text-xl font-bold text-gray-700">Total Projects</span>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow-lg !p-6 flex flex-col items-center border border-gray-100 opacity-60">
              <span className="text-5xl font-extrabold text-black !mb-3">—</span>
              <span className="text-xl font-bold text-gray-700">Coming Soon</span>
            </div>
          </div>
          {/* Main Outlet */}
          <main className="flex-1 w-full !p-6 md:!p-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-[80vh]">
            <div className=" mx-auto">
              <Outlet context={{ projects, loading, addProject, deleteProject, updateProject }} />
            </div>
          </main>
        </div>
      </div>
    </AdminAuthWrapper>
  );
};

export default AdminLayout;
