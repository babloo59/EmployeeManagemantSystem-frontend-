import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Spinner, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../service/api";

function PendingApprovals() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/manager/pending-users");
      setUsers(response.data);
      setApprovalCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load pending approvals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/manager/approve/${id}`);
      alert("User approved successfully!");
      fetchPendingUsers();
    } catch (err) {
      console.error("Error approving user:", err);
      alert("Failed to approve user. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/manager/reject/${id}`);
      alert("User rejected successfully!");
      fetchPendingUsers();
    } catch (err) {
      console.error("Error rejecting user:", err);
      alert("Failed to reject user. Please try again.");
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Pending Approvals</h2>
            <p className="text-muted">Review and approve new user registrations</p>
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
                <h5 className="text-muted">Pending Approvals</h5>
                <h2 className="text-primary">{approvalCount}</h2>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading pending approvals...</p>
          </div>
        ) : users.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Pending Approvals</h5>
              <p className="text-muted">All users have been approved!</p>
            </Card.Body>
          </Card>
        ) : (
          /* Users Table */
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Registered Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-US")}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        className="me-2"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(user.id)}
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

export default PendingApprovals;
