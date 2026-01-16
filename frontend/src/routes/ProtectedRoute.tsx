import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { FRONTEND_ROUTES } from "../constants/frontendRoutes";

const ProtectedRoute = () => {
  const accessToken = useSelector((state: RootState) => state.token.accessToken);

  if (!accessToken) return <Navigate to={FRONTEND_ROUTES.LOGIN} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
