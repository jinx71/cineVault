import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-600/30 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-display font-bold text-white shadow-card">
            C
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Cine<span className="text-gold-400">Vault</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" end className={linkClass}>
            Discover
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/watchlist" className={linkClass}>
              My Watchlist
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-400">Hi, {user?.name?.split(' ')[0]}</span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={open ? 'M6 18 18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'}
            />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="space-y-1 border-t border-slate-800 px-4 py-3 sm:hidden">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Discover
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/watchlist" className={linkClass} onClick={() => setOpen(false)}>
              My Watchlist
            </NavLink>
          )}
          <div className="pt-2">
            {isAuthenticated ? (
              <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
