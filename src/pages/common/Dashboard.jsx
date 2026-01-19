import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Navbar,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../service/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");

    setRole(userRole);
    setUser({ email: userEmail, role: userRole });
    setLoading(false);
  }, []);

  const isAdmin = role === "ADMIN";

  const loadAdminStats = useCallback(() => {
    fetchPendingUsers();
    fetchPendingTaskCount();
    fetchLeaveRequestCount();
    fetchPendingReportCount();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminStats();
    }
  }, [isAdmin, loadAdminStats]);

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get("/admin/active-users");
      setApprovalCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    }
  };

  const [pendingTaskCount, setPendingTaskCount] = useState(0);

  const fetchPendingTaskCount = async () => {
    try {
      const response = await api.get("/admin/pending-tasks");
      setPendingTaskCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending tasks:", err);
    }
  };

  const [pendingReportCount, setPendingReportCount] = useState(0);

  const fetchPendingReportCount = async () => {
    try {
      const response = await api.get("/admin/pending-reports");
      setPendingReportCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending tasks:", err);
    }
  };

  const [leaveRequestCount, setLeaveRequestCount] = useState(0);

  const fetchLeaveRequestCount = async () => {
    try {
      const response = await api.get("/admin/pending");
      setLeaveRequestCount(response.data.length);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const isManager = role === "MANAGER";

  const loadManagerStats = useCallback(() => {
    fetchManagerPendingUsers();
    fetchManagerPendingTaskCount();
    fetchManagerLeaveRequestCount();
    fetchManagerPendingReportCount();
  }, []);

  useEffect(() => {
    if (isManager) {
      loadManagerStats();
    }
  }, [isManager, loadManagerStats]);

  const [managerApprovalCount, setManagerApprovalCount] = useState(0);

  const fetchManagerPendingUsers = async () => {
    try {
      const response = await api.get("/manager/active-users");
      setManagerApprovalCount(response.data.length);
      console.log(managerApprovalCount);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    }
  };

  const [managerPendingTaskCount, setManagerPendingTaskCount] = useState(0);

  const fetchManagerPendingTaskCount = async () => {
    try {
      const response = await api.get("/manager/pending-tasks");
      setManagerPendingTaskCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending tasks:", err);
    }
  };

  const [managerPendingReportCount, setManagerPendingReportCount] = useState(0);

  const fetchManagerPendingReportCount = async () => {
    try {
      const response = await api.get("/manager/pending-reports");
      setManagerPendingReportCount(response.data.length);
    } catch (err) {
      console.error("Error fetching pending tasks:", err);
    }
  };

  const [managerLeaveRequestCount, setManagerLeaveRequestCount] = useState(0);

  const fetchManagerLeaveRequestCount = async () => {
    try {
      const response = await api.get("/manager/pending");
      setManagerLeaveRequestCount(response.data.length);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
        <Container fluid>
          <Navbar.Brand href="#" className="fw-bold">
            EMS Dashboard
          </Navbar.Brand>
          <Link to="/profile" className="btn btn-outline-primary">
            View Profile
          </Link>

          <Nav className="ms-auto">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="user-menu">
                {user?.email}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item disabled>
                  Role: <strong>{role}</strong>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-5">
        {/* Welcome Section */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="bg-primary text-white">
              <Card.Body>
                <h2>Welcome to Employee Management System</h2>
                <p className="mb-0">
                  Logged in as: <strong>{user?.email}</strong> ({role})
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Admin Dashboard */}
        {role === "ADMIN" && (
          <Row className="g-4 mb-5">
            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>👥</h3>
                  <Card.Title>Manage Employees</Card.Title>
                  <p className="text-muted">Assign roles and departments</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/admin/manage-users")}
                  >
                    Go to Manage Employees
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✓</h3>
                  <Card.Title>Pending Approvals</Card.Title>
                  <p className="text-muted">Approve new registrations</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/admin/pending-approvals")}
                  >
                    View Pending
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📋</h3>
                  <Card.Title>Leave Approvals</Card.Title>
                  <p className="text-muted">Approve / Reject employee leaves</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/admin/leave-approval")}
                  >
                    View Leave Requests
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>🗂️</h3>
                  <Card.Title>Assign Tasks</Card.Title>
                  <p className="text-muted">Assign tasks to employees</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/admin/assign-task")}
                  >
                    Assign Task
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✅</h3>
                  <Card.Title>Approve Reports</Card.Title>
                  <p className="text-muted">
                    Review & approve submitted task reports
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/admin/approve-reports")}
                  >
                    Approve Reports
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>🏢</h3>
                  <Card.Title>Departments</Card.Title>
                  <p className="text-muted">Manage departments</p>
                  <Button variant="primary" disabled>
                    Coming Soon
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Manager Dashboard */}
        {role === "MANAGER" && (
          <Row className="g-4 mb-5">
            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>👥</h3>
                  <Card.Title>Manage Employees</Card.Title>
                  <p className="text-muted">Assign roles and departments</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/manage-users")}
                  >
                    Go to Manage Employees
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✓</h3>
                  <Card.Title>Pending Approvals</Card.Title>
                  <p className="text-muted">Approve new registrations</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/pending-approvals")}
                  >
                    View Pending
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📋</h3>
                  <Card.Title>Leave Approvals</Card.Title>
                  <p className="text-muted">Approve / Reject employee leaves</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/leave-approval")}
                  >
                    View Leave Requests
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>🗂️</h3>
                  <Card.Title>Assign Tasks</Card.Title>
                  <p className="text-muted">Assign tasks to employees</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/assign-task")}
                  >
                    Assign Task
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✅</h3>
                  <Card.Title>Approve Reports</Card.Title>
                  <p className="text-muted">
                    Review & approve submitted task reports
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/approve-reports")}
                  >
                    Approve Reports
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📝</h3>
                  <Card.Title>Apply Leave</Card.Title>
                  <p className="text-muted">Request time off</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/apply-leave")}
                  >
                    Apply Leave
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✓</h3>
                  <Card.Title>My Tasks</Card.Title>
                  <p className="text-muted">View assigned tasks</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/tasks")}
                  >
                    View Tasks
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📄</h3>
                  <Card.Title>My Reports</Card.Title>
                  <p className="text-muted">Submit & view task reports</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/manager/reports")}
                  >
                    View Reports
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📊</h3>
                  <Card.Title>Reports</Card.Title>
                  <p className="text-muted">Team performance reports</p>
                  <Button variant="primary" disabled>
                    Coming Soon
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Employee Dashboard */}
        {role === "EMPLOYEE" && (
          <Row className="g-4 mb-5">
            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📝</h3>
                  <Card.Title>Apply Leave</Card.Title>
                  <p className="text-muted">Request time off</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/employee/apply-leave")}
                  >
                    Apply Leave
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>✓</h3>
                  <Card.Title>My Tasks</Card.Title>
                  <p className="text-muted">View assigned tasks</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/employee/tasks")}
                  >
                    View Tasks
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📄</h3>
                  <Card.Title>My Reports</Card.Title>
                  <p className="text-muted">Submit & view task reports</p>
                  <Button
                    variant="primary"
                    onClick={() => navigateTo("/employee/reports")}
                  >
                    View Reports
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <h3>📊</h3>
                  <Card.Title>Attendance</Card.Title>
                  <p className="text-muted">View your attendance</p>
                  <Button variant="primary" disabled>
                    Coming Soon
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {isAdmin && (
          <Row className="mt-5">
            <Col md={12}>
              <Card>
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Quick Stats</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-primary">{approvalCount}</h4>
                        <p className="text-muted">Active Users</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-success">{pendingTaskCount}</h4>
                        <p className="text-muted">Pending Tasks</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-warning">{leaveRequestCount}</h4>
                        <p className="text-muted">Leave Requests</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-success">{pendingReportCount}</h4>
                        <p className="text-muted">Pending Reports</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )};

        {isManager && (
          <Row className="mt-5">
            <Col md={12}>
              <Card>
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Quick Stats</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-primary">{managerApprovalCount}</h4>
                        <p className="text-muted">Active Users</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-success">{managerPendingTaskCount}</h4>
                        <p className="text-muted">Pending Tasks</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-warning">{managerLeaveRequestCount}</h4>
                        <p className="text-muted">Leave Requests</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h4 className="text-success">{managerPendingReportCount}</h4>
                        <p className="text-muted">Pending Reports</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )};
      </Container>
    </div>
  );
}

export default Dashboard;
