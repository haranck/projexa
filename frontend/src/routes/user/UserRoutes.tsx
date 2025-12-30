import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../../pages/Landing/LandingPage'
import { SignupPage } from '../../pages/Auth/SignupPage'
import { LoginPage } from '../../pages/Auth/LoginPage'
import { HomePage } from '../../pages/Home/HomePage'
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
            <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={FRONTEND_ROUTES.HOME} element={<HomePage />} />
        </Routes>
    )
}

export default UserRoutes
