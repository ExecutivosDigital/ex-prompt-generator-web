import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import PrivateRoute from "@/components/guards/PrivateRoute";
import PaidRoute from "@/components/guards/PaidRoute";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import TrainingLayout from "@/components/training/TrainingLayout";
import ChatPage from "@/pages/ChatPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CongratulationsPage from "@/pages/CongratulationsPage";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LandingPage1 from "@/pages/LandingPage1";
import LandingPage2 from "@/pages/LandingPage2";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import PromptsPage from "@/pages/PromptsPage";
import QuizPage from "@/pages/QuizPage";
import RegisterPage from "@/pages/RegisterPage";
import SkillPage from "@/pages/SkillPage";
import TrainingCoursePage from "@/pages/TrainingCoursePage";
import TrainingLessonPage from "@/pages/TrainingLessonPage";
import TrainingModulePage from "@/pages/TrainingModulePage";
import TrainingPage from "@/pages/TrainingPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Landing pages públicas */}
            <Route path="/landing-page-1" element={<LandingPage1 />} />
            <Route path="/landing-page-2" element={<LandingPage2 />} />

            {/* Public routes (não logado) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Checkout: logado mas não precisa ter pago */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/checkout/parabens"
                element={<CongratulationsPage />}
              />
            </Route>

            {/* App: logado + pagou */}
            <Route element={<PaidRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/skill" element={<SkillPage />} />
                <Route path="/prompts" element={<PromptsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Training: logado + pagou, layout próprio */}
              <Route element={<TrainingLayout />}>
                <Route path="/training" element={<TrainingPage />} />
                <Route
                  path="/training/:courseId"
                  element={<TrainingCoursePage />}
                />
                <Route
                  path="/training/:courseId/:moduleId"
                  element={<TrainingModulePage />}
                />
                <Route
                  path="/training/:courseId/:moduleId/:lessonId"
                  element={<TrainingLessonPage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
