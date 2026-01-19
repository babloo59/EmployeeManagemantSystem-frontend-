import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Card,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import api from "../../service/api";

function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reportCount, setReportCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    taskId: "",
    description: "",
  });

  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const reportRes = await api.get("/employee/my-reports");
      setReports(reportRes.data);
      console.log(reports);
      setReportCount(reportRes.data.length);

      const taskRes = await api.get("/employee/in-progress-tasks");
      setTasks(taskRes.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const submitReport = async () => {
    if (!form.taskId || !form.description.trim()) {
      alert("Please select task and write description");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/employee/submit-report", {
        taskId: Number(form.taskId),
        description: form.description,
      });

      alert("Report submitted successfully");

      setShowModal(false);
      setForm({ taskId: "", description: "" });

      loadPageData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const reportStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning"; // PENDING
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>My Reports</h2>
            <p className="text-muted">Submit and track your task reports</p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* STATS */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-muted">Total Submitted Reports</h5>
            <h2 className="text-primary">{reportCount}</h2>
          </Card.Body>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="mb-4 text-end">
          <Button
            variant="success"
            disabled={tasks.length === 0}
            onClick={() => setShowModal(true)}
          >
            ➕ Submit Report
          </Button>
          {tasks.length === 0 && (
            <div className="text-muted mt-2">
              No IN-PROGRESS tasks available
            </div>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : reports.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Reports Submitted</h5>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.taskTitle}</strong>
                    </td>
                    <td>{r.description}</td>
                    <td>
                      <Badge bg={reportStatusBadge(r.status)}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Submit Report</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>

              <Form.Group className="mb-3">
                <Form.Label>Select Task (IN PROGRESS)</Form.Label>
                <Form.Select
                  value={form.taskId}
                  onChange={(e) =>
                    setForm({ ...form, taskId: e.target.value })
                  }
                >
                  <option value="">-- Select Task --</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Report Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Form.Group>

            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              disabled={submitting}
              onClick={submitReport}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
}

export default Reports;
