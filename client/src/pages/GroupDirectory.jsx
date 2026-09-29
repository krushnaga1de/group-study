import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const GroupDirectory = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      setError('');
      await api.post(`/groups/${groupId}/join`);
      fetchGroups(); // refresh list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join group');
    }
  };

  if (loading) return <div>Loading groups...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Group Directory</h1>
        <p className="mt-2 text-gray-600">Discover and join study groups.</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">No groups available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(group => (
            <div key={group._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{group.name}</h3>
                  {group.isFull && !group.isMember && (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                     Full
                   </span>
                  )}
                  {!group.isFull && !group.isMember && (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     Open
                   </span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {group.subject}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{group.description}</p>
                <div className="text-sm text-gray-600 flex justify-between items-center">
                  <span>Admin: {group.admin?.name || 'Unknown'}</span>
                  <span className="font-semibold">{group.memberCount} / {group.maxMembers}</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                {group.isMember ? (
                  <Link to={`/groups/${group._id}`} className="w-full text-center text-indigo-600 font-medium hover:text-indigo-800">
                    Open Hub
                  </Link>
                ) : user.role === 'student' ? (
                  <button 
                    onClick={() => handleJoin(group._id)} 
                    disabled={group.isFull}
                    className={`w-full py-2 rounded font-medium transition-colors ${
                      group.isFull 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {group.isFull ? 'Full' : 'Join Group'}
                  </button>
                ) : (
                  <span className="w-full text-center text-gray-500 text-sm italic">Admins cannot join</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDirectory;
