import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", data);

      const { token, role, firstLogin } = res.data;

      // ✅ Store auth data correctly
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", data.email);
      localStorage.setItem("firstLogin", String(firstLogin));

      // ✅ Redirect logic
      if (firstLogin === true) {
        navigate("/force-change-password");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      const errorData = err.response?.data;

      let message = "Login failed. Please try again.";

      if (typeof errorData === "string") {
        message = errorData;
      } else if (errorData?.message) {
        message = errorData.message;
      }

      if (message.toLowerCase().includes("pending")) {
        setError("Your account is pending approval");
      } else if (message.toLowerCase().includes("rejected")) {
        setError("Your account has been rejected");
      } else if (message.toLowerCase().includes("invalid")) {
        setError("Invalid email or password");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-3">Login</h4>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <Link to="/forgot-password" className="text-primary small">
                    Forgot Password?
                  </Link>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary">
                    Create an account
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
