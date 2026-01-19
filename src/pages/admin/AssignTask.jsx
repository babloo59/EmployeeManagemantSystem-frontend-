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
} from "react-bootstrap";
import api from "../../service/api";

function AssignTask() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignToRole, setAssignToRole] = useState("EMPLOYEE");

  const [showModal, setShowModal] = useState(false);

  const loggedInEmail = localStorage.getItem("email");

  const [taskForm, setTaskForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);

      const userRes = await api.get("/admin/active-users");
      setEmployees(userRes.data);

      const taskRes = await api.get("/admin/my-assigned-tasks");
      setTasks(taskRes.data);
    } catch (err) {
      setError("Failed to load assign task data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async () => {
    try {
      await api.post("/admin/assign-task", {
        ...taskForm,
        role: assignToRole,
      });

      alert("Task assigned successfully!");
      setShowModal(false);
      loadPageData();
    } catch (err) {
      console.log(err);
      alert("Failed to assign task");
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Assign Tasks</h2>
            <p className="text-muted">
              Tasks assigned by <strong>{loggedInEmail}</strong>
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="text-muted">Total Assigned Tasks</h5>
            <h2 className="text-primary">{tasks.length}</h2>
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
        ) : tasks.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h5 className="text-muted">No Tasks Assigned Yet</h5>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Employee</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.employee?.fullName}</strong>
                      <br />
                      <small>{task.employee?.email}</small>
                    </td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.deadline}</td>
                    <td>
                      <span className="badge bg-warning">{task.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Assign Task Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Assign Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Assign To Role</Form.Label>
                <Form.Select
                  value={assignToRole}
                  onChange={(e) => setAssignToRole(e.target.value)}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select User</Form.Label>
                <Form.Select
                  value={taskForm.employeeId}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, employeeId: e.target.value })
                  }
                >
                  <option value="">-- Select --</option>
                  {employees
                    .filter((u) => u.role === assignToRole)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.email})
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, deadline: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Back
            </Button>
            <Button variant="success" onClick={handleAssignTask}>
              Assign Task
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default AssignTask;
