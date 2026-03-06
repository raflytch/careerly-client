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
import InterviewsPage from "@/modules/interview/pages/InterviewsPage";
import CreateInterviewPage from "@/modules/interview/pages/CreateInterviewPage";
import InterviewDetailPage from "@/modules/interview/pages/InterviewDetailPage";
import PlansPage from "@/modules/plan/pages/PlansPage";
import TransactionsPage from "@/modules/plan/pages/TransactionsPage";
import TransactionCallbackPage from "@/modules/plan/pages/TransactionCallbackPage";
import TransactionSuccessPage from "@/modules/plan/pages/TransactionSuccessPage";
import TransactionPendingPage from "@/modules/plan/pages/TransactionPendingPage";
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
          {
            path: "interviews",
            element: <InterviewsPage />,
          },
          {
            path: "interviews/create",
            element: <CreateInterviewPage />,
          },
          {
            path: "interviews/:id",
            element: <InterviewDetailPage />,
          },
          {
            path: "plans",
            element: <PlansPage />,
          },
          {
            path: "transactions",
            element: <TransactionsPage />,
          },
          {
            path: "transactions/callback",
            element: <TransactionCallbackPage />,
          },
          {
            path: "transactions/success",
            element: <TransactionSuccessPage />,
          },
          {
            path: "transactions/pending",
            element: <TransactionPendingPage />,
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
