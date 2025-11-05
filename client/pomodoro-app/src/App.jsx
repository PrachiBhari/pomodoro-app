import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import TimerPage from "./pages/TimerPage";
import TasksPage from "./pages/TasksPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              {/* public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* private */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<TimerPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
      </TasksProvider>
      
    </AuthProvider>
  );
}
