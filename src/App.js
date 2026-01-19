import { Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/common/Dashboard";
import PendingApprovals from "./pages/admin/PendingApprovals";
import ManageEmployees from "./pages/admin/ManageEmployees";
import AddEmployee from "./pages/admin/AddEmployee";
import RoleRoute from "./components/RoleRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/error/Unauthorized";
import EditEmployee from "./pages/admin/EditEmployee";
import ViewProfile from "./pages/common/ViewProfile";
import LeaveApproval from "./pages/admin/LeaveApproval";
import AssignTask from "./pages/admin/AssignTask";
import NotFound from "./pages/error/NotFound";
import ApplyLeave from "./pages/employee/ApplyLeave";
import MyTasks from "./pages/employee/MyTasks";
import Reports from "./pages/employee/Reports";
import ApproveReports from "./pages/admin/ApproveReports";
import ManagerPendingApprovals from "./pages/manager/ManagerPendingApprovals";
import ManagerManageEmployees from "./pages/manager/ManagerManageEmployees";
import ManagerAddEmployee from "./pages/manager/ManagerAddEmployee";
import ManagerEditEmployee from "./pages/manager/ManagerEditEmployee";
import ManagerLeaveApproval from "./pages/manager/ManagerLeaveApproval";
import ManagerAssignTask from "./pages/manager/ManagerAssignTask";
import ManagerApproveReports from "./pages/manager/ManagerApproveReports";
import ManagerApplyLeave from "./pages/manager/ManagerApplyLeave";
import ManagerMyTasks from "./pages/manager/ManagerMyTasks";
import ManagerReports from "./pages/manager/ManagerReports";
import ForceChangePassword from "./pages/common/ForceChangePassword";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Common Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/force-change-password" element={<ForceChangePassword />} />


        {/* Admin Routes */}
        <Route element={<RoleRoute role="ADMIN" />}>
          <Route
            path="/admin/pending-approvals"
            element={<PendingApprovals />}
          />
          <Route path="/admin/manage-users" element={<ManageEmployees />} />
          <Route path="/admin/add-user" element={<AddEmployee />} />
          <Route path="/admin/edit-user/:id" element={<EditEmployee />} />
          <Route path="/admin/leave-approval" element={<LeaveApproval />} />
          <Route path="/admin/assign-task" element={<AssignTask />} />
          <Route path="/admin/approve-reports" element={<ApproveReports />} />
        </Route>

        {/* Manager Routes */}
        <Route element={<RoleRoute role="MANAGER" />}>
          <Route
            path="/manager/pending-approvals"
            element={<ManagerPendingApprovals />}
          />
          <Route path="/manager/manage-users" element={<ManagerManageEmployees />} />
          <Route path="/manager/add-user" element={<ManagerAddEmployee />} />
          <Route path="/manager/edit-user/:id" element={<ManagerEditEmployee />} />
          <Route path="/manager/leave-approval" element={<ManagerLeaveApproval />} />
          <Route path="/manager/assign-task" element={<ManagerAssignTask />} />
          <Route path="/manager/approve-reports" element={<ManagerApproveReports />} />
          <Route path="/manager/apply-leave" element={<ManagerApplyLeave />} />
          <Route path="/manager/tasks" element={<ManagerMyTasks />} />
          <Route path="/manager/reports" element={<ManagerReports />} />
        </Route>

        {/* Employee Routes */}
        <Route element={<RoleRoute role="EMPLOYEE" />}>
          <Route path="/employee/apply-leave" element={<ApplyLeave />} />
          <Route path="/employee/tasks" element={<MyTasks />} />
          <Route path="/employee/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Unauthorized Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
