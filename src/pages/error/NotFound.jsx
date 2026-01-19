import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container className="text-center">
        <h1 className="display-3 fw-bold text-danger">404</h1>
        <h3 className="mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Button className="me-2" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>

        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    </div>
  );
}

export default NotFound;
