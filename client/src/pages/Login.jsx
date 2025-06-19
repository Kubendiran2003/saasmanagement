import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600">
      <div className="bg-white p-10 rounded-xl shadow-xl w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">TenantHub</h1>
        <p className="text-gray-500 mb-6">SaaS Tenant Management Platform</p>
        <form onSubmit={handleSubmit} className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />

          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center text-sm">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Sign in
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4">Demo: Use any email/password</p>
        <p className="text-sm text-blue-600 mt-2">
          Don't have an account? <Link to="/register" className="underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;