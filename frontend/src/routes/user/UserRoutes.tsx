import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../../pages/Landing/LandingPage'
import { SignupPage } from '../../pages/Auth/SignupPage'
import { LoginPage } from '../../pages/Auth/LoginPage'
import { HomePage } from '../../pages/Home/HomePage'
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes'
import { ForgotPassword } from '../../pages/Auth/ForgotPassword'
import { ResetPassword } from '../../pages/Auth/ResetPassword'
import { SettingsPage } from '@/pages/Settings/SettingsPage'
import { ProjectsPage } from '@/pages/Projects/ProjectsPage'
import { ChatPage } from '@/pages/Chat/ChatPage'
import { MeetingsPage } from '@/pages/Meeting/MeetingsPage'
import { TeamsPage } from '@/pages/Teams/TeamsPage'
import { PaymentsPage } from '@/pages/Payments/PaymentsPage'
import { BacklogPage } from '@/pages/Backlog/BacklogPage'
import { BoardPage } from '@/pages/Board/BoardPage'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
            <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
            <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={FRONTEND_ROUTES.HOME} element={<HomePage />} />
            <Route path={FRONTEND_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={FRONTEND_ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={FRONTEND_ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={FRONTEND_ROUTES.PROJECTS} element={<ProjectsPage />} />
            <Route path={FRONTEND_ROUTES.CHAT} element={<ChatPage />} />
            <Route path={FRONTEND_ROUTES.MEETINGS} element={<MeetingsPage />} />
            <Route path={FRONTEND_ROUTES.TEAMS} element={<TeamsPage />} />
            <Route path={FRONTEND_ROUTES.PAYMENTS} element={<PaymentsPage />} />
            <Route path={FRONTEND_ROUTES.BACKLOG} element={<BacklogPage />} />
            <Route path={FRONTEND_ROUTES.BOARD} element={<BoardPage />} />
        </Routes>
    )
}

export default UserRoutes
