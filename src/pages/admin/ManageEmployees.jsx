import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Card,
  Alert,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/view-employees");
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.put(`/admin/employee/status/${id}?userStatus=${newStatus}`);
      loadUsers();
    } catch {
      alert("Failed to update status");
    }
  };

  const editUser = (id) => {
    navigate(`/admin/edit-user/${id}`);
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>

        {/* Back */}
        <div className="d-flex justify-content-between mb-3">
          <h2>Manage Employees & Managers</h2>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Count */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h6 className="text-muted">Total Users</h6>
            <h3 className="text-primary">{users.length}</h3>
          </Card.Body>
        </Card>

        {/* Header */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Button onClick={() => navigate("/admin/add-user")}>
            + Add Employee / Manager
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge bg={u.role === "MANAGER" ? "info" : "secondary"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={u.status === "ACTIVE" ? "success" : "secondary"}
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => editUser(u.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            u.status === "ACTIVE" ? "danger" : "success"
                          }
                          onClick={() => toggleStatus(u.id, u.status)}
                        >
                          {u.status === "ACTIVE" ? "Block" : "Unblock"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {users.length === 0 && (
                <div className="text-center text-muted py-3">
                  No users found
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default ManageUsers;
