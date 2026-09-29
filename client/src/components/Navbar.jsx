import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Users, LayoutDashboard, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white text-gray-900 shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">StudyGroup</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/groups" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  <Users className="h-4 w-4" />
                  <span>Groups</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                    {user.name} <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full ml-1">{user.role}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors bg-gray-50 p-2 rounded-lg"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:inline-block text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
                  Sign up (Admin / Student)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
