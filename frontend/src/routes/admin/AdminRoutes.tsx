import { Routes, Route } from "react-router-dom";
import { AdminLoginPage } from "../../pages/Auth/AdminLoginPage";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { Dashboard } from "../../pages/Admin/Dashboard/Dashboard";
import { AdminDashboardLayout } from "../../components/Layout/Admin/AdminDashboardLayout";
import { UsersPage } from "../../pages/Admin/UserManagement/UsersPage";
import { SalesReport } from "../../pages/Admin/SalesReport/SalesReport";
import { Subscription } from "../../pages/Admin/Subscriptions/Subscription";
import { Workspace } from "../../pages/Admin/Workspace/Workspace";
import { PaymentDetails } from "../../pages/Admin/PaymentDetails/PaymentDetails";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

      <Route element={<AdminDashboardLayout />}>
        <Route path={FRONTEND_ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
        <Route path={FRONTEND_ROUTES.ADMIN_USERS} element={<UsersPage />} />
        <Route path={FRONTEND_ROUTES.ADMIN_SALES_REPORT} element={<SalesReport />} />
        <Route path={FRONTEND_ROUTES.ADMIN_SUBSCRIPTIONS} element={<Subscription />} />
        <Route path={FRONTEND_ROUTES.ADMIN_WORKSPACES} element={<Workspace />} />
        <Route path={FRONTEND_ROUTES.ADMIN_PAYMENTS_DETAILS} element={<PaymentDetails />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
