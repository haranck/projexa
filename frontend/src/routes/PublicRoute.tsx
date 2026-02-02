import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"

const PublicRoute = () => {
    const accessToken = useSelector((state: RootState) => state.token.accessToken)
    const user = useSelector((state: RootState) => state.auth.user)

    if (accessToken) {
        if (user?.hasWorkspace) {
            return <Navigate to={FRONTEND_ROUTES.HOME} replace />
        } else {
            return <Navigate to={FRONTEND_ROUTES.WORKSPACE.CREATE_WORKSPACE} replace />
        }
    }
    return <Outlet />
}

export default PublicRoute
