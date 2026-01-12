import { Routes,Route } from "react-router-dom";
import { AdminLoginPage } from "../../pages/Auth/AdminLoginPage";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const AdminRoutes = () => { 
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
    </Routes>
  );
};

export default AdminRoutes; 