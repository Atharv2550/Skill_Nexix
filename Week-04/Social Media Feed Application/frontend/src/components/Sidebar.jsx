import { Home, LogOut, Radio, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import Avatar from './Avatar';
import logo from '../assets/logo.svg';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200/80 bg-white px-5 py-6">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 px-2">
        <img src={logo} alt="PulseFeed logo" className="h-9 w-9" />
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            PulseFeed
          </span>
          <p className="text-[11px] font-medium text-slate-400">Real-time community</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="mt-8 flex-1 space-y-1.5">
        <NavLink to="/" end className={navLinkClass}>
          <Home className="h-5 w-5" />
          <span>Home Feed</span>
        </NavLink>

        <NavLink to={`/profile/${user?._id}`} className={navLinkClass}>
          <User className="h-5 w-5" />
          <span>My Profile</span>
        </NavLink>
      </nav>

      {/* Live Socket Status */}
      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Radio
            className={`h-3.5 w-3.5 ${
              isConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
            }`}
          />
          <span className={isConnected ? 'text-emerald-700' : 'text-slate-500'}>
            {isConnected ? 'Live updates connected' : 'Connecting live feed...'}
          </span>
        </div>
      </div>

      {/* User Mini-Card & Logout */}
      <div className="border-t border-slate-100 pt-4">
        <Link
          to={`/profile/${user?._id}`}
          className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition"
        >
          <Avatar src={user?.profilePicture} name={user?.fullName} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.fullName}
            </p>
            <p className="truncate text-xs text-slate-500">@{user?.username}</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

