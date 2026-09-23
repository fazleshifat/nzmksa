import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, {
  ProtectedNoNav,
  AdminRoute,
} from './components/ProtectedRoute';

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import PersonalDetails from './pages/Profile/PersonalDetails';
import Passport from './pages/Profile/Passport';
import ResidentId from './pages/Profile/ResidentId';
import Visa from './pages/Profile/Visa';
import Services from './pages/Services/Services';
import Family from './pages/Family/Family';
import Workers from './pages/Workers/Workers';
import Other from './pages/Other/Other';
import Settings from './pages/Settings/Settings';

import useAndroidBackButton from './hooks/useAndroidBackButton';
import DrivingLicense from './pages/Profile/DrivingLicense';
import LaborImportations from './pages/Profile/LaborImportations';
import TravelRecord from './pages/Profile/TravelRecord';
import Welcome from './pages/Welcome/Welcome';
import Admin from './pages/Admin/Admin';
import EditUser from './pages/Admin/EditUser';
import ViewUser from './pages/Admin/ViewUser';

function AppRoutes() {
  useAndroidBackButton();

  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith('/admin');

  return (
    <div
      className={
        isAdminRoute
          ? 'min-h-[100dvh] w-full bg-gray-50 font-sans!'
          : 'relative mx-auto min-h-[100dvh] w-full max-w-md bg-black font-sans!'
      }
    >
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />

          <Route
            path="/admin/users/:id"
            element={<ViewUser />}
          />

          <Route
            path="/admin/users/:id/edit"
            element={<EditUser />}
          />
        </Route>

        {/* User routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/family" element={<Family />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/other" element={<Other />} />
        </Route>

        <Route element={<ProtectedNoNav />}>
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/profile/personal-details"
            element={<PersonalDetails />}
          />

          <Route
            path="/profile/passport"
            element={<Passport />}
          />

          <Route
            path="/profile/resident-id"
            element={<ResidentId />}
          />

          <Route
            path="/profile/visa"
            element={<Visa />}
          />

          <Route
            path="/profile/driving-license"
            element={<DrivingLicense />}
          />

          <Route
            path="/profile/labor-importance"
            element={<LaborImportations />}
          />

          <Route
            path="/profile/travel-record"
            element={<TravelRecord />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* Global user chat button */}
      {/* <FloatingChatButton /> */}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}