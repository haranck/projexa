import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../../pages/Landing/LandingPage'
import { SignupPage } from '../../pages/Auth/SignupPage'
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes'
import { LoginPage } from '../../pages/Auth/LoginPage'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
            <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />} />
        </Routes>
    )
}

export default UserRoutes
