import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      // Dashboard shows groups that user is a member of (for both admins and students)
      const filtered = res.data.filter(g => g.isMember);
      setGroups(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
        <p className="mt-2 text-gray-600">
          View the study groups you've joined.
        </p>
        {user.role === 'admin' && (
           <p className="mt-2 text-indigo-600 font-medium">
             <Link to="/admin">Go to the Admin Panel</Link> to create and manage groups.
           </p>
        )}
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
        {groups.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500">You don't have any groups yet.</p>
            {user.role === 'student' && (
              <Link to="/groups" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                Browse Groups
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(group => (
              <div key={group._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{group.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {group.subject}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{group.description}</p>
                  <div className="text-sm text-gray-600">
                    <p>Members: <span className="font-semibold">{group.memberCount}</span> / {group.maxMembers}</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <Link to={`/groups/${group._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center justify-center w-full">
                    Enter Study Hub
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
