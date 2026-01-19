import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Card,
  Modal,
  Form,
  Badge,
} from "react-bootstrap";
import api from "../../service/api";

function ApplyLeave() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveCount, setLeaveCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      // employee ke apne leaves
      const res = await api.get("/employee/my-leaves");

      setLeaves(res.data);
      setLeaveCount(res.data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async () => {
    if (!form.reason || !form.startDate || !form.endDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/employee/apply-leave", form);
      alert("Leave applied successfully!");
      setShowModal(false);
      setForm({ reason: "", startDate: "", endDate: "" });
      fetchMyLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to apply leave");
    }
  };

  const statusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>My Leave Applications</h2>
            <p className="text-muted">Apply and track your leave requests</p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-muted">Total Applied Leaves</h5>
            <h2 className="text-primary">{leaveCount}</h2>
          </Card.Body>
        </Card>

        <div className="mb-4 text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            ➕ Assign New Task
          </Button>
        </div>

        {/* Error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : leaves.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Leave Applications Found</h5>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Reason</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.reason}</td>
                    <td>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <Badge bg={statusVariant(leave.status)}>
                        {leave.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Apply Leave Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Apply Leave</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Back
            </Button>
            <Button variant="success" onClick={handleApplyLeave}>
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ApplyLeave;
