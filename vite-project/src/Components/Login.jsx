import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const payload = {
          email: formData.email,
          password: formData.password
        };
        console.log("Login Request Payload:", payload);
        const response = await axios.post("http://localhost:7000/api/auth/login", payload);
        console.log("Login Response:", response.data);
        localStorage.setItem("userId", response.data.userId);
        setIsLoading(false);
        window.location.href = "/test";
      } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        setErrors({ api: error.response?.data || "Login failed" });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {errors.api && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {errors.api}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className={`border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className={`border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="text-sm text-right mt-3 text-gray-500">
            Forgot password?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer">
              Click here
            </span>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600">
            {"Don't"} have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;