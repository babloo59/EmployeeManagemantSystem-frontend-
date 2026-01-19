import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../../service/api";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
    designation: "",
    status: "PENDING",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadEmployee = async () => {
    try {
      const res = await api.get(`/manager/employee/${id}`);
      setForm({
        fullName: res.data.fullName,
        email: res.data.email,
        department: res.data.department,
        designation: res.data.designation,
        status: res.data.status,
      });
      console.log(form);
    } catch {
      setError("Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.department || !form.designation) {
      setError("All fields are required");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/manager/update-employee/${id}`, form);

      alert("Employee updated successfully");
      navigate("/manager/manage-employees");
    } catch (err) {
      setError(err.response?.data || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container style={{ maxWidth: "600px" }}>
        <Card className="shadow">
          <Card.Body>
            <h3 className="mb-4 text-center">Edit Employee</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
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
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="IT / HR / Finance"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Designation *</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Software Engineer / HR Executive"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="REJECTED">REJECTED</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner size="sm" /> : "Update Employee"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EditEmployee;
