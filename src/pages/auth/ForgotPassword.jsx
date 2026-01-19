import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data || "Password reset link sent to your email");
      setEmail("");
    } catch (err) {
      setError(err.response?.data || "Failed to process request");
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
              <h4 className="text-center mb-3">Forgot Password</h4>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your registered email"
                  />
                </div>

                <button 
                  className="btn btn-primary w-100" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary">
                    Back to Login
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

export default ForgotPassword;
