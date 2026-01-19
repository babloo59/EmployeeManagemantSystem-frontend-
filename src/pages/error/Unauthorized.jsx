import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow text-center p-4" style={{ maxWidth: "420px" }}>
        <h1 className="text-danger fw-bold mb-2">403</h1>
        <h4 className="mb-3">Unauthorized Access</h4>

        <p className="text-muted">
          You do not have permission to access this page.
        </p>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>

          <Link to="/login" className="btn btn-outline-secondary">
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
