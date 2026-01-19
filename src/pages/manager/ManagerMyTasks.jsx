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

function MyTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/manager/my-tasks");
      setTasks(res.data);
      setTaskCount(res.data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const acceptTask = async (taskId) => {
    try {
      await api.put(`/manager/accept-task/${taskId}`);
      alert("Task accepted!");
      fetchMyTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to accept task");
    }
  };

  const statusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "info";
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
            <h2>My Tasks</h2>
            <p className="text-muted">Tasks assigned to you</p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-muted">Total Assigned Tasks</h5>
            <h2 className="text-primary">{taskCount}</h2>
          </Card.Body>
        </Card>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Tasks Assigned</h5>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Assigned By</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.title}</strong></td>
                    <td>{task.description}</td>
                    <td>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <Badge bg={statusVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </td>
                    <td>{task.manager?.fullName || "Admin"}</td>

                    {/* ACTION */}
                    <td className="text-center">
                      {task.status === "PENDING" ? (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => acceptTask(task.id)}
                        >
                          Accept
                        </Button>
                      ) : (
                        "—"
                      )}
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

export default MyTasks;
