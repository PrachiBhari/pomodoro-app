import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">Pomodoro</Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthed ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-gray-800 text-white text-sm hover:bg-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1 rounded border">Login</Link>
              <Link to="/register" className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
