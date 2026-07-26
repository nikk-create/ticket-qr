import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronDown, LayoutDashboard, LogOut, Ticket, User } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/AuthContext';

const navLinks = [
  { to: '/', label: 'Événements', icon: CalendarDays },
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, auth: true },
  { to: '/reservations', label: 'Réservations', icon: Ticket, auth: true },
];

export default function AppHeader() {
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const initials = (profile?.full_name || user?.email || '?').trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-sand/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <Logo size={30} className="shrink-0" />
          <span className="truncate font-display text-base font-semibold text-teal-950 sm:text-lg">TicketQR</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((l) => !l.auth || isAuthenticated)
            .map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-teal-900/5 hover:text-teal-900"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/organizer" className="btn-secondary hidden sm:inline-flex">
                Espace organisateur
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-teal-900/15 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-teal-950 transition-colors hover:border-teal-900/30"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-900 text-xs font-semibold text-sand">
                    {initials}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-xl border border-teal-900/10 bg-white shadow-card">
                    <div className="border-b border-teal-900/10 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-ink">{profile?.full_name || 'Organisateur'}</p>
                      <p className="truncate text-xs text-ink/50">{user?.email}</p>
                    </div>
                    <Link
                      to="/organizer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-teal-900/5 sm:hidden"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Espace organisateur
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-teal-900/5"
                    >
                      <User className="h-4 w-4" /> Mon profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-teal-900/10 px-4 py-2.5 text-left text-sm text-rust-500 hover:bg-rust-500/5"
                    >
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Se connecter</Link>
              <Link to="/register" className="btn-primary hidden sm:inline-flex">Créer un compte</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-teal-900/10 px-4 py-2 md:hidden">
        {navLinks
          .filter((l) => !l.auth || isAuthenticated)
          .map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-teal-900/5"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
      </nav>
    </header>
  );
}
