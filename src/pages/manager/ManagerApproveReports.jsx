import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";
import api from "../../service/api";

function ApproveReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportCount, setReportCount] = useState(0);

  const fetchPendingReports = async () => {
    try {
      setLoading(true);
      setError("");

      // manager ke paas aaye hue reports
      const res = await api.get("/manager/pending-reports");
      setReports(res.data);
      console.log(reports);
      setReportCount(res.data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load submitted reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const approveReport = async (reportId) => {
    try {
      await api.put(`/manager/approve-report/${reportId}`);
      alert("Report approved. Task marked as COMPLETED");
      fetchPendingReports();
    } catch (err) {
      console.error(err);
      alert("Failed to approve report");
    }
  };

  const rejectReport = async (reportId) => {
    try {
      await api.put(`/manager/reject-report/${reportId}`);
      alert("Report rejected. Task remains IN_PROGRESS");
      fetchPendingReports();
    } catch (err) {
      const msg = err.response?.data || "Failed to reject report";
      console.error("Error rejecting report:", msg);
      setError(msg);
      alert(msg);
    }
  };

  const statusBadge = (status) => {
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
            <h2>Approve Reports</h2>
            <p className="text-muted">
              Review and approve employee task reports
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* STATS */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-muted">Pending Reports</h5>
            <h2 className="text-primary">{reportCount}</h2>
          </Card.Body>
        </Card>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : reports.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Pending Reports</h5>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Employee</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.employeeName}</strong>
                    </td>
                    <td>{r.taskTitle}</td>
                    <td>{r.description}</td>
                    <td>
                      <Badge bg={statusBadge(r.status)}>{r.status}</Badge>
                    </td>

                    {/* ACTION */}
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => approveReport(r.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => rejectReport(r.id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ApproveReports;
