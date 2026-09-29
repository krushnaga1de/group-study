import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Clock, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center -mt-8">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl overflow-hidden shadow-2xl mt-8 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/50 rounded-full px-4 py-1.5 backdrop-blur-sm border border-indigo-500/30 mb-4 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-100">Study smarter, together</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight animate-fade-in-up">
            Master your subjects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Collaborative Learning</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-100">
            Create groups, schedule study sessions, and communicate seamlessly. Built exclusively for highly effective students and passionate educators.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up delay-200">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all shadow-lg hover:shadow-pink-500/30">
                  Get Started as Student
                </Link>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-950 text-indigo-100 border border-indigo-700 rounded-full font-bold text-lg hover:bg-indigo-900 hover:scale-105 transition-all shadow-lg">
                  Create Admin Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose StudyGroup?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to organize study groups, enforce limits, and manage your learning efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Group Limits</h3>
            <p className="text-gray-600">Strictly enforced maximum capacity per group to keep study sessions focused and intimate.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Scheduling</h3>
            <p className="text-gray-600">Admins can schedule precise dates and times for upcoming group study sessions easily.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Access</h3>
            <p className="text-gray-600">Private message boards and session details restricted only to verified group members.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Hubs</h3>
            <p className="text-gray-600">Each group gets its own isolated Study Hub for resources, chat, and meeting links.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
