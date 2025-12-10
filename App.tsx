import React, { useState, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { User } from './types';
import { calculateWeights, getRandomColor } from './services/storage';
import { authenticateUser, getUserData, saveUserData } from './services/db';
import { Settings, PlayCircle, LogOut, User as UserIcon, Lock } from 'lucide-react';

const Login = ({ onLogin, error }: { onLogin: (username: string, password: string) => void; error: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-brutal-teal border-3 border-brutal-dark shadow-hard flex items-center justify-center">
              <span className="text-brutal-dark font-black text-3xl">W?</span>
            </div>
            <h1 className="text-4xl font-black text-brutal-dark uppercase tracking-tighter italic">Who.Will?</h1>
          </div>
          <p className="text-brutal-dark font-bold">Enter your credentials to continue</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Demo accounts: <strong>admin</strong>/admin123, <strong>demo</strong>/demo123</p>
            <p className="text-green-600 font-bold">Or enter any new username/password to create account</p>
          </div>
        </div>

        <div className="bg-white border-3 border-brutal-dark shadow-hard-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-brutal-coral border-l-3 border-b-3 border-brutal-dark -mr-10 -mt-10 rotate-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-brutal-yellow border-r-3 border-t-3 border-brutal-dark -ml-8 -mb-8 -rotate-12"></div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div>
              <label className="block text-brutal-dark font-bold text-sm uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brutal-dark" size={20} strokeWidth={2.5} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-3 border-brutal-dark bg-white text-brutal-dark font-bold placeholder-gray-400 focus:outline-none focus:shadow-hard-sm transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-brutal-dark font-bold text-sm uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brutal-dark" size={20} strokeWidth={2.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-3 border-brutal-dark bg-white text-brutal-dark font-bold placeholder-gray-400 focus:outline-none focus:shadow-hard-sm transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brutal-teal border-3 border-brutal-dark text-brutal-dark font-black text-lg uppercase tracking-wider shadow-hard hover:-translate-y-1 hover:-translate-x-1 hover:shadow-hard-lg active:translate-y-0 active:translate-x-0 active:shadow-hard transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'picker' | 'admin'>('picker');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setUsers(getUserData(savedUser));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0 && currentUser) {
      saveUserData(currentUser, users);
    }
  }, [users, currentUser]);

  const handleLogin = (username: string, password: string) => {
    if (authenticateUser(username, password)) {
      localStorage.setItem('current-user', username);
      setCurrentUser(username);
      setUsers(getUserData(username));
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('current-user');
    setCurrentUser(null);
    setUsers([]);
    setLoginError('');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, { ...newUser, id: Date.now().toString(), color: getRandomColor() }]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleResetCounts = () => {
    if (window.confirm('Are you sure you want to reset all counts to zero?')) {
      setUsers(prev => prev.map(u => ({ ...u, count: 0 })));
    }
  };

  const handleSpinEnd = (winnerId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === winnerId) {
        return { ...u, count: u.count + 1 };
      }
      return u;
    }));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brutal-bg text-brutal-dark">
      <header className="bg-white border-b-3 border-brutal-dark sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('picker')}>
            <div className="w-10 h-10 bg-brutal-teal border-2 border-brutal-dark shadow-hard-sm group-hover:shadow-hard transition-all flex items-center justify-center">
              <span className="text-brutal-dark font-black text-lg">W?</span>
            </div>
            <h1 className="text-2xl font-black text-brutal-dark uppercase tracking-tighter italic">Who.Will?</h1>
          </div>
          
          <nav className="flex items-center gap-3">
            <div className="text-brutal-dark font-bold text-sm mr-4">
              Welcome, {currentUser}
            </div>
            <button
              onClick={() => !isSpinning && setActiveTab('picker')}
              className={`flex items-center gap-2 px-5 py-2 border-2 border-brutal-dark text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'picker' 
                  ? 'bg-brutal-yellow text-brutal-dark shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5' 
                  : 'bg-white text-gray-500 hover:text-brutal-dark hover:bg-gray-50'
              } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSpinning}
            >
              <PlayCircle size={20} strokeWidth={2.5} />
              Picker
            </button>
            <button
              onClick={() => !isSpinning && setActiveTab('admin')}
              className={`flex items-center gap-2 px-5 py-2 border-2 border-brutal-dark text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'admin' 
                  ? 'bg-brutal-blue text-brutal-dark shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5' 
                  : 'bg-white text-gray-500 hover:text-brutal-dark hover:bg-gray-50'
              } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSpinning}
            >
              <Settings size={20} strokeWidth={2.5} />
              Manage
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 border-2 border-brutal-dark text-sm font-bold uppercase tracking-wider bg-white text-gray-500 hover:text-brutal-dark hover:bg-gray-50 transition-all"
            >
              <LogOut size={20} strokeWidth={2.5} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10">
        {activeTab === 'picker' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-brutal-dark mb-4 uppercase italic">Who's Next?</h2>
                <div className="inline-block bg-white border-2 border-brutal-dark px-4 py-2 shadow-hard-sm">
                  <p className="text-brutal-dark font-bold text-sm md:text-base">
                    SPIN THE WHEEL • FAIR ODDS • NO BIAS
                  </p>
                </div>
             </div>
             
             <div className="bg-white border-3 border-brutal-dark shadow-hard-xl p-6 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brutal-teal border-l-3 border-b-3 border-brutal-dark -mr-16 -mt-16 rotate-12 z-0"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-brutal-coral border-r-3 border-t-3 border-brutal-dark -ml-12 -mb-12 -rotate-12 z-0"></div>
               
               <div className="relative z-10">
                 <Wheel 
                   users={users} 
                   onSpinEnd={handleSpinEnd}
                   isSpinning={isSpinning}
                   setIsSpinning={setIsSpinning}
                 />
               </div>
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminPanel 
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onResetCounts={handleResetCounts}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t-3 border-brutal-dark py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-brutal-dark uppercase tracking-wider">
            Who.Will? © {new Date().getFullYear()}
          </div>
          <div className="flex gap-4">
            <span className="w-4 h-4 bg-brutal-teal border border-brutal-dark shadow-[2px_2px_0_0_#000]"></span>
            <span className="w-4 h-4 bg-brutal-coral border border-brutal-dark shadow-[2px_2px_0_0_#000]"></span>
            <span className="w-4 h-4 bg-brutal-yellow border border-brutal-dark shadow-[2px_2px_0_0_#000]"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
