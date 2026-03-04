import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomePage from "@/modules/home/pages/HomePage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import AuthCallbackPage from "@/modules/auth/pages/AuthCallbackPage";
import RestoreAccountPage from "@/modules/auth/pages/RestoreAccountPage";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import ProfilePage from "@/modules/dashboard/pages/ProfilePage";
import ResumesPage from "@/modules/resume/pages/ResumesPage";
import CreateResumePage from "@/modules/resume/pages/CreateResumePage";
import EditResumePage from "@/modules/resume/pages/EditResumePage";
import ResumeDetailPage from "@/modules/resume/pages/ResumeDetailPage";
import AtsChecksPage from "@/modules/ats/pages/AtsChecksPage";
import AtsCheckDetailPage from "@/modules/ats/pages/AtsCheckDetailPage";
import NotFoundPage from "@/modules/errors/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth/callback",
        element: <AuthCallbackPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "restore",
            element: <RestoreAccountPage />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "resumes",
            element: <ResumesPage />,
          },
          {
            path: "resumes/create",
            element: <CreateResumePage />,
          },
          {
            path: "resumes/:id",
            element: <ResumeDetailPage />,
          },
          {
            path: "resumes/:id/edit",
            element: <EditResumePage />,
          },
          {
            path: "ats-checks",
            element: <AtsChecksPage />,
          },
          {
            path: "ats-checks/:id",
            element: <AtsCheckDetailPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
