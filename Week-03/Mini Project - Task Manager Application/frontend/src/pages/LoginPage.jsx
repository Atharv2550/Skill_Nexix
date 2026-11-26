import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListTodo, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "../components/AlertBanner";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/dashboard", {
        replace: true,
        state: { alert: { type: "success", message: "Logged in successfully." } },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon auth-brand-icon">
            <ListTodo size={24} />
          </div>
          <h1>Welcome back</h1>
          <p>Log in to manage your tasks</p>
        </div>

        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError("")}
        />

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

