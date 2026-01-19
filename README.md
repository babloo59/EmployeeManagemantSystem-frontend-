# 🧑‍💼 Employee Management System – Frontend

This repository contains the **Frontend (React.js)** application for the **Employee Management System (EMS)**.  
The system supports **Admin, Manager, and Employee roles** with JWT authentication, role-based routing, and **force password change on first login**.

---

## 🔗 Backend Repository

👉 **Backend (Spring Boot + MySQL)**  
🔗 https://github.com/your-username/employee-management-system-backend

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Token expiry handling & auto logout
- Role-based access control (ADMIN / MANAGER / EMPLOYEE)
- Protected routes using React Router
- **Force Change Password on First Login**

### 👤 Role-wise Capabilities

#### 👑 Admin
- Approve / Reject user registrations
- Manage employees & managers
- Assign tasks
- Approve / Reject leave requests
- Approve / Reject reports

#### 🧑‍💼 Manager
- Manage employees
- Assign tasks to employees
- Approve employee leaves
- Approve employee reports
- Submit own task reports

#### 👷 Employee
- View assigned tasks
- Accept tasks
- Submit task reports
- Apply for leave
- Track report & leave status

---

## 🛠️ Tech Stack

- React.js
- React Router v6
- Axios
- Bootstrap / React-Bootstrap
- JWT Authentication
- REST API Integration

---

## 📁 Project Structure

```
frontend/
├── src/
│ ├── pages/
│ │ ├── auth/ # Login, Register, Force Change Password
│ │ ├── admin/
│ │ ├── manager/
│ │ ├── employee/
│ │ ├── common/
│ │ └── error/
│ ├── components/
│ │ ├── ProtectedRoute.jsx
│ │ └── RoleRoute.jsx
│ ├── service/
│ │ └── api.js
│ ├── utils/
│ │ └── auth.js
│ ├── App.js
│ └── index.js
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/employee-management-system-frontend.git
cd employee-management-system-frontend
```
### 2️⃣ Install Dependencies
```
npm install
```
### 3️⃣ Configure Backend API

- Update src/service/api.js:
```
baseURL: "http://localhost:8080/api"
```

- Ensure backend is running on port 8080.

### 4️⃣ Run Application
```
npm start
```

- Frontend will run at:
```
http://localhost:3000
```

## 🔐 Authentication Flow

- User logs in
- Backend returns:
-- JWT token
-- Role
-- firstLogin flag
- Frontend stores auth data in localStorage
- Routing logic:
-- firstLogin === true → /force-change-password
-- Otherwise → /dashboard

## 🔁 Force Change Password (First Login)

- New users must change password on first login
- Dashboard access is blocked until password is changed
- After password update:
-- Token is cleared
-- User is forced to login again

## 🛡️ Route Protection

- ProtectedRoute
-- Checks authentication & first login
- RoleRoute
-- Restricts access based on role
- Unauthorized access redirects to /unauthorized

## ⚠️ Notes

- Backend must be running before frontend
- Clear localStorage if token issues occur
- Do not commit .env or sensitive credentials

## 📌 Future Improvements

- Forgot password via email
- Profile image upload
- Pagination & search
- Deployment on Vercel / Render

## 👨‍💻 Author

- Babloo Kumar
- Computer Science Engineer
- Java + React Full Stack Developer

