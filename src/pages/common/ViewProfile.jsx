import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

function ViewProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    department: "",
    designation: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);

      setForm({
        fullName: res.data.fullName,
        department: res.data.department || "",
        designation: res.data.designation || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/me", form);
      alert("Profile updated successfully");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      alert(err.response?.data || "Failed to update profile");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post("/change-password", passwordForm);
      alert("Password changed successfully");
      setPasswordMode(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data || "Failed to change password");
    }
  };

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="m-4">{error}</Alert>;
  }

  /* ================= UI ================= */
  return (
    <div className="min-vh-100 bg-light py-5">
      <Container style={{ maxWidth: "600px" }}>
        <Card className="shadow">
          <Card.Body>
            <h3 className="text-center mb-4">My Profile</h3>

            {/* ===== VIEW MODE ===== */}
            {!editMode && !passwordMode && (
              <>
                <p><b>Full Name:</b> {user.fullName}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Role:</b> {user.role}</p>
                <p><b>Status:</b> {user.status}</p>
                <p><b>Department:</b> {user.department || "—"}</p>
                <p><b>Designation:</b> {user.designation || "—"}</p>

                <div className="d-flex justify-content-between mt-4">
                  <Button onClick={() => setEditMode(true)}>
                    ✏️ Edit Profile
                  </Button>

                  <Button variant="warning" onClick={() => setPasswordMode(true)}>
                    🔐 Change Password
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    ⬅ Back
                  </Button>
                </div>
              </>
            )}

            {/* ===== EDIT PROFILE ===== */}
            {editMode && (
              <Form onSubmit={handleProfileUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Email (read only)</Form.Label>
                  <Form.Control value={user.email} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    value={form.designation}
                    onChange={(e) =>
                      setForm({ ...form, designation: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            )}

            {/* ===== CHANGE PASSWORD ===== */}
            {passwordMode && (
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => setPasswordMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="warning" type="submit">
                    Change Password
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ViewProfile;
