import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginLeftPanel from "../components/loginLeftPanel";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const TOKEN_KEY = "token";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
  
      const userId = data?.user?.User_Id;
      const role = data?.user?.User_Role;
  
      console.log("🔐 Retrieved UserID:", userId);
      console.log("🧑‍💻 User Role:", role);
  
      if (!userId || !role) {
        throw new Error("Missing User ID or Role in the response.");
      }
  
      // ✅ Store user info in localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", role); // (optional)
  
      // ✅ Handle remember me
      rememberMe
        ? localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
        : localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  
      alert("✅ Login Successful!");
  
      // ✅ Redirect based on role
      navigate(role === "admin" ? "/admindashboard" : "/devdashboard");
  
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid credentials");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex w-screen">
      <LoginLeftPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-10">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">NTV30 Login</h2>
            <p className="text-sm text-gray-500 mt-2">Access your control panel below.</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-100 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username@ntv30.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
            />
          </div>

          <div className="flex items-center justify-between text-sm bg-white">
            <label className="flex items-center gap-2 ">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox "
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#1D4ED8", color: "#ffffff" }}
            className="w-full hover:bg-blue-800 font-semibold py-2 rounded-md transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
