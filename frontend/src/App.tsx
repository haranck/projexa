import UserRoutes from './routes/user/UserRoutes'
import { Toaster } from 'react-hot-toast'

export const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <UserRoutes />
    </>
  )
}
