import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { MonolithLandingPage } from './components/landing/MonolithLandingPage'
import { MonolithChatPage } from './components/MonolithChatPage'
import { MonolithLoginPage } from './components/MonolithLoginPage'
import { MonolithSignupPage } from './components/MonolithSignupPage'
import { MonolithForgotPasswordPage } from './components/MonolithForgotPasswordPage'
import { MonolithPricingPage } from './components/MonolithPricingPage'
import { MonolithProfilePage } from './components/MonolithProfilePage'
import { MonolithSettingsPage } from './components/MonolithSettingsPage'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MonolithLandingPage />} />
      <Route path="/login" element={<MonolithLoginPage />} />
      <Route path="/signup" element={<MonolithSignupPage />} />
      <Route path="/forgot-password" element={<MonolithForgotPasswordPage />} />
      <Route path="/pricing" element={<MonolithPricingPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<MonolithChatPage />} />
        <Route path="/profile" element={<MonolithProfilePage />} />
        <Route path="/settings" element={<MonolithSettingsPage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
