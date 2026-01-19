import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../service/api";

function LeaveApproval() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/manager/pending");
      setLeaves(res.data);
      console.log(res.data);
      setPendingCount(res.data.length);
      console.log(res.data.length);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setError("Failed to load leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/manager/leave/approve/${id}`);
      alert("Leave approved successfully!");
      fetchPendingLeaves();
    } catch (err) {
      console.error("Error approving leave:", err);
      alert("Failed to approve leave");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/manager/leave/reject/${id}`);
      alert("Leave rejected successfully!");
      fetchPendingLeaves();
    } catch (err) {
      console.error("Error rejecting leave:", err);
      alert("Failed to reject leave");
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Leave Approvals</h2>
            <p className="text-muted">
              Review and approve employee leave requests
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="row">
              <div className="col-md-4">
                <h5 className="text-muted">Pending Leave Requests</h5>
                <h2 className="text-primary">{pendingCount}</h2>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="mb-3" />
            <p>Loading leave requests...</p>
          </div>
        ) : leaves.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Pending Leave Requests</h5>
              <p className="text-muted">All leave requests are processed!</p>
            </Card.Body>
          </Card>
        ) : (
          /* Table */
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Employee</th>
                  <th>Reason</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <strong>{leave.employee?.fullName}</strong>
                      <br />
                      <small className="text-muted">
                        {leave.employee?.email}
                      </small>
                    </td>
                    <td>{leave.reason}</td>
                    <td>
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge bg-warning">
                        {leave.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(leave.id)}
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(leave.id)}
                      >
                        ✗ Reject
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

export default LeaveApproval;
