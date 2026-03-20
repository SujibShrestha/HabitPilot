import  { useState } from "react";
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { resetProfile } from "../store/profileSlice";
import { resetPlan } from "../store/plansSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetProfile());
    dispatch(resetPlan());
    navigate("/auth");
  };

  return (
    <nav className="w-full border-b border-border bg-background dark:bg-card dark:border-card-foreground shadow-sm transition-colors duration-500 animate-fade">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 font-bold text-xl text-foreground dark:text-card-foreground"
        >
          <img src="/logo.png" className="w-10 h-10" alt="logo" />
          <span>FitGen AI</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Navigation Links */}
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-foreground hover:text-primary transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-sm font-medium text-foreground hover:text-primary transition"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/plans")}
            className="text-sm font-medium text-foreground hover:text-primary transition"
          >
            Plans
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-accent/20 transition animate-fade-in"
          >
            {dark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-foreground dark:text-card-foreground" />
            )}
          </button>

          {/* User Section */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-secondary/10 px-3 py-2 rounded-lg transition"
            >
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="user"
                className="w-9 h-9 rounded-full border border-border"
              />
              <span className="text-sm font-medium text-foreground dark:text-card-foreground">
                {user?.name || "Guest"}
              </span>
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-2xl z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-accent/20 transition animate-fade-in"
          >
            {dark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-foreground dark:text-card-foreground" />
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-accent/20 transition"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-foreground dark:text-card-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground dark:text-card-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 animate-fade-in">
          {/* Navigation Links */}
          <button
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
            className="text-left text-sm font-medium text-foreground hover:text-primary transition py-2"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="text-left text-sm font-medium text-foreground hover:text-primary transition py-2"
          >
            Profile
          </button>
          <button
            onClick={() => {
              navigate("/plans");
              setMenuOpen(false);
            }}
            className="text-left text-sm font-medium text-foreground hover:text-primary transition py-2"
          >
            Plans
          </button>

          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="user"
                className="w-9 h-9 rounded-full border border-border"
              />
              <span className="text-sm font-medium text-foreground dark:text-card-foreground">
                {user?.name || "Guest"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-accent/20 transition w-full mb-2"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-foreground dark:text-card-foreground" />
              )}
              <span>Toggle Theme</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-destructive/10 transition w-full text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;