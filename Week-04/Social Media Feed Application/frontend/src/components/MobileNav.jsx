import { Home, LogOut, Radio, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import Avatar from './Avatar';
import logo from '../assets/logo.svg';

const MobileNav = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const bottomLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-semibold transition ${
      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="PulseFeed logo" className="h-8 w-8" />
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            PulseFeed
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span
            title={isConnected ? 'Live updates connected' : 'Offline'}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Radio className="h-3 w-3" />
            {isConnected ? 'Live' : 'Syncing'}
          </span>

          <Link to={`/profile/${user?._id}`}>
            <Avatar src={user?.profilePicture} name={user?.fullName} size="sm" />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md py-2 md:hidden">
        <NavLink to="/" end className={bottomLinkClass}>
          <Home className="h-5 w-5" />
          <span>Feed</span>
        </NavLink>

        <NavLink to={`/profile/${user?._id}`} className={bottomLinkClass}>
          <User className="h-5 w-5" />
          <span>Profile</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
};

export default MobileNav;

