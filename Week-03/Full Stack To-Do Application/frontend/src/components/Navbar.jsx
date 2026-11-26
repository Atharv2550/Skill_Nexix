import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="brand">
          <span className="brand-badge">✓</span>
          <span>TaskFlow</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">
                Hi, <strong>{user?.name || 'User'}</strong>
              </span>
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

