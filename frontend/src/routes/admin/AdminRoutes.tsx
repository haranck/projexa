import { Routes, Route } from "react-router-dom";
import { AdminLoginPage } from "../../pages/Auth/AdminLoginPage";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { Dashboard } from "../../pages/Admin/Dashboard/Dashboard";
import { AdminDashboardLayout } from "../../components/Layout/Admin/AdminDashboardLayout";
import { Users } from "../../pages/Admin/UserManagement/Users";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

      <Route element={<AdminDashboardLayout />}>
        <Route path={FRONTEND_ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
        <Route path={FRONTEND_ROUTES.ADMIN_USERS} element={<Users />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
