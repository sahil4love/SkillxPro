import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Coins, User as UserIcon, LogOut, ShieldAlert, BookOpen, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, adminUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg2 border-b border-slate-200 shadow-sm h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-black text-primary tracking-tight">
                Skill<span className="text-accent">x</span>Pro
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-1 h-16">
              <Link 
                to="/" 
                className={`relative px-3 flex items-center h-full text-sm font-bold tracking-wide transition-colors ${
                  isActive('/') ? 'text-primary' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <span>Home</span>
                {isActive('/') && (
                  <div className="absolute bottom-0 left-3 right-3 h-1 bg-primary rounded-t-full" />
                )}
              </Link>
              
              {user && (
                <Link 
                  to="/dashboard" 
                  className={`relative px-3 flex items-center h-full text-sm font-bold tracking-wide transition-colors ${
                    isActive('/dashboard') ? 'text-primary' : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <span>Dashboard</span>
                  {isActive('/dashboard') && (
                    <div className="absolute bottom-0 left-3 right-3 h-1 bg-primary rounded-t-full" />
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {adminUser && (
              <Link 
                to="/admin" 
                className={`flex items-center text-xs font-bold text-danger hover:underline uppercase tracking-wider ${
                  isActive('/admin') ? 'underline underline-offset-4 font-black' : ''
                }`}
              >
                <ShieldAlert className="w-4 h-4 mr-1" />
                Admin Panel
              </Link>
            )}

            {/* User Controls */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Tokens display */}
                <div className="flex items-center google-badge-blue border border-primary/20 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                  <Coins className="w-3.5 h-3.5 mr-1.5 text-warning fill-warning" />
                  <span>{user.tokens} Tokens</span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full px-3 py-1.5 transition-all text-xs font-bold text-textPrimary"
                  >
                    <img 
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full border border-slate-200"
                    />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-bg2 border border-slate-200 shadow-elevation2 py-2.5 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-slate-100 text-xs text-textSecondary truncate">
                        Signed in as <br />
                        <span className="font-bold text-textPrimary">{user.identifier}</span>
                      </div>
                      <Link 
                        to="/dashboard?tab=profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-textSecondary hover:text-textPrimary hover:bg-slate-50 transition-colors font-medium"
                      >
                        <UserIcon className="w-4 h-4 mr-2.5 text-textSecondary" />
                        My Profile
                      </Link>
                      <Link 
                        to="/dashboard?tab=skills" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-textSecondary hover:text-textPrimary hover:bg-slate-50 transition-colors font-medium"
                      >
                        <BookOpen className="w-4 h-4 mr-2.5 text-textSecondary" />
                        My Skills
                      </Link>
                      <Link 
                        to="/dashboard?tab=chat" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-textSecondary hover:text-textPrimary hover:bg-slate-50 transition-colors font-medium"
                      >
                        <MessageSquare className="w-4 h-4 mr-2.5 text-textSecondary" />
                        Chat Hub
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-danger hover:text-danger-dark hover:bg-red-50 border-t border-slate-100 transition-colors text-left font-bold"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : adminUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs uppercase bg-danger/10 text-danger border border-danger/20 rounded-full px-3 py-0.5 font-bold">
                  Admin Active
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center bg-slate-50 border border-slate-200 hover:bg-slate-100 text-danger text-xs font-bold rounded-full px-4 py-1.5 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-textSecondary hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login?tab=register" 
                  className="google-btn-primary text-sm px-6 py-2.5 shadow-sm active:scale-95 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-textSecondary hover:text-textPrimary focus:outline-none p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-bg2 border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 animate-fade-in shadow-elevation2 z-50">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-base font-bold ${
              isActive('/') ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Home
          </Link>
          
          {user && (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-bold ${
                  isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center justify-between px-3 py-2.5 text-primary font-bold text-sm bg-primary/10 rounded-xl">
                <div className="flex items-center">
                  <Coins className="w-4 h-4 mr-1.5 text-warning fill-warning" />
                  <span>Your Balance</span>
                </div>
                <span>{user.tokens} Tokens</span>
              </div>
            </>
          )}

          {adminUser && (
            <Link 
              to="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-danger font-bold hover:bg-red-50 rounded-xl"
            >
              👮 Admin Panel
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2.5 text-danger hover:bg-red-50 rounded-xl font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            ) : adminUser ? (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2.5 text-danger hover:bg-red-50 rounded-xl font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out Admin
              </button>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full border border-slate-200 text-textSecondary py-2.5 rounded-full text-sm font-bold hover:border-slate-300"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login?tab=register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full google-btn-primary py-2.5 text-sm active:scale-95 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
