import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/register", formData);
      setMessage(response.data);
      setFormData({ fullName: "", email: "", password: "" });
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Server not responding");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-3">Employee Registration</h4>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Register
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary">
                    Login here
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

export default Register;
