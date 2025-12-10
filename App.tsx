import React, { useState, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { User } from './types';
import { getStoredUsers, saveUsers } from './services/storage';
import { Settings, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'picker' | 'admin'>('picker');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      saveUsers(users);
    }
  }, [users]);

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
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

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brutal-bg text-brutal-dark">
      {/* Header */}
      <header className="bg-white border-b-3 border-brutal-dark sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('picker')}>
            <div className="w-10 h-10 bg-brutal-teal border-2 border-brutal-dark shadow-hard-sm group-hover:shadow-hard transition-all flex items-center justify-center">
              <span className="text-brutal-dark font-black text-2xl">F</span>
            </div>
            <h1 className="text-2xl font-black text-brutal-dark uppercase tracking-tighter italic">FairPick</h1>
          </div>
          
          <nav className="flex items-center gap-3">
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
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
               {/* Decorative background pattern */}
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

      {/* Footer */}
      <footer className="bg-white border-t-3 border-brutal-dark py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-brutal-dark uppercase tracking-wider">
            FairPick © {new Date().getFullYear()}
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