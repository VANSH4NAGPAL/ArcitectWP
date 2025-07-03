import React, { useState, useEffect } from "react";

const AdminAuthWrapper = ({ children }) => {
  const [access, setAccess] = useState(
    sessionStorage.getItem("admin-auth") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");

  const correctPassword = import.meta.env.VITE_ADMIN_PASS;

  useEffect(() => {
    // Listen for sessionStorage changes (including from logout)
    const handleStorage = () => {
      setAccess(sessionStorage.getItem("admin-auth") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Also check on every render (for same-tab logout)
  useEffect(() => {
    setAccess(sessionStorage.getItem("admin-auth") === "true");
  });

  const handleLogin = () => {
    if (passwordInput === correctPassword) {
      setAccess(true);
      sessionStorage.setItem("admin-auth", "true");
    } else {
      alert("Wrong password");
    }
  };

  if (!access) {
    return (
      <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-100 !px-4">
        <div className="!bg-white !p-8 !rounded-xl !shadow-xl !w-full !max-w-sm">
          <h2 className="!text-xl !font-semibold !mb-4 !text-center !text-black">
            Admin Access
          </h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !mb-4 !text-black"
          />
          <button
            onClick={handleLogin}
            className="!w-full !bg-black !text-white !py-2 !rounded-lg hover:!bg-gray-800"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
