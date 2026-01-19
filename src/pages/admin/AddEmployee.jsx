import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "EMPLOYEE",
    department: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName ||
      !form.email ||
      !form.department ||
      !form.designation
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/add-employee", form);

      navigate("/admin/manage-users");
    } catch (err) {
      setError(err.response?.data || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container style={{ maxWidth: "600px" }}>
        <Card className="shadow">
          <Card.Body>
            <h3 className="text-center mb-4">Add Employee / Manager</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>Role *</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department *</Form.Label>
                <Form.Control
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Designation *</Form.Label>
                <Form.Control
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Create User"}
                </Button>
              </div>
            </Form>

            <div className="mt-3 text-muted text-center">
              User will be created with <b>PENDING</b> status
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AddUser;
