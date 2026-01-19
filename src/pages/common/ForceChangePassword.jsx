import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../../service/api";

function ForceChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return "All fields are required";
    }

    // if (form.newPassword.length < 6) {
    //   return "New password must be at least 6 characters";
    // }

    if (form.newPassword !== form.confirmPassword) {
      return "New password and confirm password do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await api.post("/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      // ✅ VERY IMPORTANT
      localStorage.setItem("firstLogin", "false");

      alert("Password changed successfully. Please login again.");

      // 🔐 Force re-login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");

      navigate("/login");
    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data ||
        "Failed to change password. Please try again.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container style={{ maxWidth: "450px" }}>
        <Card className="shadow">
          <Card.Body>
            <h4 className="text-center mb-3">🔐 Change Password</h4>

            <p className="text-muted text-center mb-4">
              This is your first login. You must change your password to
              continue.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" /> Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ForceChangePassword;
