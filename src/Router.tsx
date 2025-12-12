import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/Dashboard.page';
import ActivityPage from './pages/DashboardSubpages/Activity.page';
import CustomCategoryPage from './pages/DashboardSubpages/CustomCategory.page';
import OverviewPage from './pages/DashboardSubpages/Overview.page';
import SleepPage from './pages/DashboardSubpages/Sleep.page';
import WaterPage from './pages/DashboardSubpages/Water.page';
import LoginPage from './pages/Login.page';
import RegisterPage from './pages/Register.page';

const requireAuth = async () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) {
    return redirect('/login');
  }
  return null;
};

const forwardIfAuth = async () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    return redirect('/dashboard');
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    loader: forwardIfAuth,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    loader: forwardIfAuth,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    loader: requireAuth,
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'water', element: <WaterPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'sleep', element: <SleepPage /> },
      { path: 'custom', element: <CustomCategoryPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
