import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for Admin creating a group
  const [newGroup, setNewGroup] = useState({ name: '', description: '', subject: '', maxMembers: 2 });
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      // Filter groups created by this admin
      const filtered = res.data.filter(g => g.admin._id === user._id);
      setGroups(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setCreateError('');
      await api.post('/groups', newGroup);
      setNewGroup({ name: '', description: '', subject: '', maxMembers: 2 });
      fetchGroups(); // Refresh the list
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create group');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading admin panel...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-gray-600">
          Manage your study groups and create new ones.
        </p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Create a New Group</h2>
        {createError && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-md">{createError}</div>}
        <form onSubmit={handleCreateGroup} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Name</label>
              <input
                type="text" required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text" required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newGroup.subject} onChange={e => setNewGroup({...newGroup, subject: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required rows="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Members (2-100)</label>
            <input
              type="number" min="2" max="100" required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={newGroup.maxMembers} onChange={e => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium">
            Create Group
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Groups You Manage</h2>
        {groups.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500">You haven't created any groups yet.</p>
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
                    Manage Study Hub
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

export default AdminPanel;
