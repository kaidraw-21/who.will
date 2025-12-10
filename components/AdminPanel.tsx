import React, { useState } from 'react';
import { User } from '../types';
import { Trash2, RefreshCcw, Plus } from 'lucide-react';
import { getRandomColor, calculateWeights } from '../services/storage';

interface AdminPanelProps {
  users: User[];
  onUpdateUser: (updatedUser: User) => void;
  onAddUser: (newUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onResetCounts: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, 
  onUpdateUser, 
  onAddUser, 
  onDeleteUser, 
  onResetCounts 
}) => {
  const [newUserName, setNewUserName] = useState('');
  
  const usersWithStats = calculateWeights(users);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      count: 0,
      color: getRandomColor(),
    };
    
    onAddUser(newUser);
    setNewUserName('');
  };

  const handleCountChange = (user: User, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdateUser({ ...user, count: num });
    }
  };

  const handleColorChange = (user: User, val: string) => {
    onUpdateUser({ ...user, color: val });
  };

  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResetCounts();
  };

  return (
    <div className="bg-white border-3 border-brutal-dark shadow-hard-lg">
      <div className="p-4 sm:p-6 border-b-3 border-brutal-dark bg-brutal-blue flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brutal-dark uppercase tracking-tight">Participants</h2>
          <p className="text-sm font-bold text-brutal-dark opacity-75">Manage names, colors, and weights</p>
        </div>
        <button 
          type="button"
          onClick={handleResetClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brutal-dark bg-brutal-coral border-2 border-brutal-dark shadow-hard-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-hard transition-all active:translate-y-0 active:translate-x-0 active:shadow-none"
        >
          <RefreshCcw size={18} strokeWidth={3} />
          RESET COUNTS
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="mb-8 flex gap-3">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="ENTER NAME..."
            className="flex-1 px-4 py-3 border-3 border-brutal-dark bg-gray-50 font-bold text-lg placeholder:text-gray-400 focus:outline-none focus:bg-white focus:shadow-hard-sm transition-all rounded-none"
          />
          <button 
            type="submit"
            disabled={!newUserName.trim()}
            className="px-6 py-3 bg-brutal-teal text-brutal-dark border-3 border-brutal-dark font-black hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-hard hover:shadow-hard-lg active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            <Plus size={24} strokeWidth={4} />
            <span className="hidden sm:inline uppercase tracking-wider">Add</span>
          </button>
        </form>

        {/* Users Table */}
        <div className="overflow-x-auto custom-scrollbar border-3 border-brutal-dark">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brutal-dark text-white">
              <tr className="text-xs font-black uppercase tracking-wider">
                <th className="py-4 px-4 border-r-2 border-gray-600 w-20">Color</th>
                <th className="py-4 px-4 border-r-2 border-gray-600">Name</th>
                <th className="py-4 px-4 text-center border-r-2 border-gray-600">Picked</th>
                <th className="py-4 px-4 text-right border-r-2 border-gray-600">Chance</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-brutal-dark">
              {usersWithStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 italic font-bold text-lg bg-gray-50">
                    NO PARTICIPANTS YET.
                  </td>
                </tr>
              ) : (
                usersWithStats.map((user) => (
                  <tr key={user.id} className="hover:bg-brutal-blue/30 transition-colors group font-bold">
                    <td className="py-3 px-4 border-r-2 border-brutal-dark">
                      <div className="relative w-10 h-10">
                        <input 
                          type="color" 
                          value={user.color}
                          onChange={(e) => handleColorChange(user, e.target.value)}
                          className="w-full h-full p-0 border-2 border-brutal-dark cursor-pointer shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all box-border"
                          title="Change color"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 border-r-2 border-brutal-dark text-lg">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-center border-r-2 border-brutal-dark">
                      <input 
                        type="number" 
                        min="0"
                        value={user.count}
                        onChange={(e) => handleCountChange(user, e.target.value)}
                        className="w-20 px-2 py-1 text-center border-2 border-brutal-dark bg-gray-50 focus:bg-white focus:outline-none focus:shadow-hard-sm font-mono"
                      />
                    </td>
                    <td className="py-3 px-4 text-right border-r-2 border-brutal-dark tabular-nums">
                      {(user.probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        type="button"
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-brutal-dark bg-gray-100 border-2 border-brutal-dark hover:bg-red-500 hover:text-white hover:shadow-hard-sm transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                        title="Delete user"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 p-5 bg-brutal-yellow border-3 border-brutal-dark shadow-hard-sm">
           <h3 className="text-lg font-black text-brutal-dark mb-2 uppercase flex items-center gap-2">
             <span className="text-2xl">⚡</span> How it works
           </h3>
           <p className="text-sm font-bold text-brutal-dark leading-relaxed">
             This is a <strong>Fair Weighted Picker</strong>. The probability is inversely proportional to pick count.
             More picks = Smaller slice.
           </p>
           <div className="mt-3 inline-block bg-white px-3 py-1 border-2 border-brutal-dark shadow-hard-sm text-xs font-mono font-bold">
             Chance = 1 / (Picked + 1)
           </div>
        </div>
      </div>
    </div>
  );
};