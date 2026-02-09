import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../../pages/User/Landing/LandingPage'
import { SignupPage } from '../../pages/Auth/SignupPage'
import { LoginPage } from '../../pages/Auth/LoginPage'
import { HomePage } from '../../pages/User/Home/HomePage'
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes'
import { ForgotPassword } from '../../pages/Auth/ForgotPassword'
import { ResetPassword } from '../../pages/Auth/ResetPassword'
import { ProjectsPage } from '../../pages/User/Projects/ProjectsPage'
import { ChatPage } from '../../pages/User/Chat/ChatPage'
import { MeetingsPage } from '../../pages/User/Meeting/MeetingsPage'
import { TeamsPage } from '../../pages/User/Teams/TeamsPage'
import { PaymentsPage } from '../../pages/User/Payments/PaymentsPage'
import { BacklogPage } from '../../pages/User/Backlog/BacklogPage'
import { BoardPage } from '../../pages/User/Board/BoardPage'
import { UserProfile } from '../../pages/User/Profile/UserProfile'
import ProtectedRoute from '../ProtectedRoute'
import PublicRoute from '../PublicRoute'
import { CreateWorkspacePage } from '../../pages/Workspace/CreateWorkspacePage'
import { SelectPlan } from '../../pages/Workspace/SelectPlan'
import { PaymentSuccess } from '@/components/PaymentPages/PaymentSuccess'
import { PaymentCancel } from '@/components/PaymentPages/PaymentCancel'
import { AcceptInvitePage } from '@/pages/User/Teams/AcceptInvitePage'

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
                <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={FRONTEND_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={FRONTEND_ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            </Route>

            <Route path={FRONTEND_ROUTES.WORKSPACE.ACCEPT_INVITE} element={<AcceptInvitePage />} />

            <Route element={<ProtectedRoute />}>
                <Route path={FRONTEND_ROUTES.HOME} element={<HomePage />} />
                <Route path={FRONTEND_ROUTES.PROJECTS} element={<ProjectsPage />} />
                <Route path={FRONTEND_ROUTES.CHAT} element={<ChatPage />} />
                <Route path={FRONTEND_ROUTES.MEETINGS} element={<MeetingsPage />} />
                <Route path={FRONTEND_ROUTES.TEAMS} element={<TeamsPage />} />
                <Route path={FRONTEND_ROUTES.PAYMENTS} element={<PaymentsPage />} />
                <Route path={FRONTEND_ROUTES.BACKLOG} element={<BacklogPage />} />
                <Route path={FRONTEND_ROUTES.BOARD} element={<BoardPage />} />
                <Route path={FRONTEND_ROUTES.PROFILE} element={<UserProfile />} />
                <Route path={FRONTEND_ROUTES.WORKSPACE.CREATE_WORKSPACE} element={<CreateWorkspacePage />} />
                <Route path={FRONTEND_ROUTES.WORKSPACE.SELECT_PLAN} element={<SelectPlan />} />
                <Route path={FRONTEND_ROUTES.WORKSPACE.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
                <Route path={FRONTEND_ROUTES.WORKSPACE.PAYMENT_CANCEL} element={<PaymentCancel />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes
