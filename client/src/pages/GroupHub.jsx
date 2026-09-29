import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const GroupHub = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newMessage, setNewMessage] = useState('');
  const [sessionForm, setSessionForm] = useState({ subject: '', date: '', time: '', meetingDetails: '' });
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    fetchHubData();
  }, [groupId]);

  const fetchHubData = async () => {
    try {
      const [groupRes, sessionsRes, messagesRes] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/sessions`),
        api.get(`/groups/${groupId}/messages`),
      ]);
      setGroup(groupRes.data);
      setSessions(sessionsRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied – join this group first.');
      } else {
        setError('Failed to load group data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await api.post(`/groups/${groupId}/messages`, { content: newMessage });
      setNewMessage('');
      // Refresh messages
      const res = await api.get(`/groups/${groupId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      setSessionError('');
      await api.post(`/groups/${groupId}/sessions`, sessionForm);
      setSessionForm({ subject: '', date: '', time: '', meetingDetails: '' });
      // Refresh sessions
      const res = await api.get(`/groups/${groupId}/sessions`);
      setSessions(res.data);
    } catch (err) {
      setSessionError(err.response?.data?.error || 'Failed to schedule session');
    }
  };

  if (loading) return <div>Loading hub...</div>;

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 p-8 rounded-xl text-center max-w-md w-full border border-red-100">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const isAdmin = group.admin._id === user._id;

  return (
    <div className="space-y-8">
      <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">{group.description}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
              {group.subject}
            </span>
            <p className="text-sm text-gray-500">
              Members: <span className="font-semibold">{group.members.length}</span> / {group.maxMembers}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sessions & Messages */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sessions Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Sessions</h2>
            </div>
            <div className="p-6">
              {sessions.filter(s => new Date(`${s.date}T${s.time}`) > new Date()).length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">No upcoming sessions scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {sessions.filter(s => new Date(`${s.date}T${s.time}`) > new Date()).map(session => (
                    <div key={session._id} className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/30">
                      <h3 className="font-bold text-indigo-900">{session.subject}</h3>
                      <div className="mt-2 text-sm text-gray-600 flex flex-col sm:flex-row sm:space-x-4">
                        <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                        <span>⏰ {session.time}</span>
                      </div>
                      <div className="mt-3 text-sm">
                        <span className="font-semibold">Details: </span> 
                        {/* Protect against XSS by just rendering text. Or if it's a link, we could parse it, but text is safer. */}
                        {session.meetingDetails}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Messages Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Message Board</h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col-reverse">
              {messages.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">Be the first to post a message!</p>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`flex flex-col ${msg.author._id === user._id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.author._id === user._id 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-medium">{msg.author.name}</span>
                      <span>•</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <form onSubmit={handlePostMessage} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  required
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                  Send
                </button>
              </form>
            </div>
          </section>

        </div>

        {/* Right Column: Admin Tools & Members List */}
        <div className="space-y-8">
          
          {isAdmin && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-lg font-bold text-indigo-900">Schedule Session</h2>
              </div>
              <div className="p-6">
                {sessionError && <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{sessionError}</div>}
                <form onSubmit={handleScheduleSession} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                      value={sessionForm.subject} onChange={e => setSessionForm({...sessionForm, subject: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                        value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                        value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meeting Details (Link/Location)</label>
                    <textarea required rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                      value={sessionForm.meetingDetails} onChange={e => setSessionForm({...sessionForm, meetingDetails: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">
                    Schedule
                  </button>
                </form>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Members</h2>
              <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {group.members.length} / {group.maxMembers}
              </span>
            </div>
            <ul className="divide-y divide-gray-200">
              {group.members.map(member => (
                <li key={member._id} className="px-6 py-4 flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member._id === group.admin._id ? 'Admin' : 'Student'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default GroupHub;
