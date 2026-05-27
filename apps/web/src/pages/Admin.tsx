import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Users, BookOpen, Coins, AlertOctagon, UserX, UserCheck, 
  Trash2, Plus
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { 
    allUsers, skills, config,
    updateUserStatus, distributeTokens, deleteSkill, updateConfig
  } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'skills' | 'config'>('overview');

  // Distribute Tokens state
  const [targetUser, setTargetUser] = useState('');
  const [distAmt, setDistAmt] = useState(50);
  const [distReason, setDistReason] = useState('Contributor Contribution Bonus');
  const [distSuccess, setDistSuccess] = useState('');
  const [distError, setDistError] = useState('');

  // Total tokens in platform economy
  const totalEconomyTokens = allUsers.reduce((sum, u) => sum + u.tokens, 0);

  // Distribute tokens to a user
  const handleDistributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDistSuccess('');
    setDistError('');

    if (!targetUser) { setDistError('Please select a target user.'); return; }
    if (distAmt <= 0) { setDistError('Amount must be positive.'); return; }

    distributeTokens(targetUser, distAmt, distReason);
    setDistSuccess(`✓ Successfully distributed ${distAmt} tokens to ${targetUser}!`);
    setDistReason('Contributor Contribution Bonus');
    setDistAmt(50);
  };

  // Toggle user suspension
  const handleToggleUserStatus = (identifier: string, currentStatus?: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = `Are you sure you want to change user status to ${nextStatus} for ${identifier}?`;
    if (!window.confirm(confirmMsg)) return;

    updateUserStatus(identifier, nextStatus);
  };

  // Delete marketplace listing
  const handleDeleteSkill = (id: number, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the listing "${name}"?`);
    if (!confirmDelete) return;

    deleteSkill(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Admin header */}
      <div className="google-card border-emerald-500/30 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-elevation2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-textPrimary flex items-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mr-2" />
            SuperAdmin Command Center
          </h1>
          <p className="text-xs text-emerald-400/80 font-bold uppercase tracking-wider">
            System status: active &middot; SkillxPro Sandbox Control Deck
          </p>
        </div>

        {/* Tab switches */}
        <div className="flex bg-bg border border-primary/10 rounded-2xl p-1 gap-1 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeAdminTab === 'overview' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeAdminTab === 'users' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            User Deck
          </button>
          <button
            onClick={() => setActiveAdminTab('skills')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeAdminTab === 'skills' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Skill Deck
          </button>
          <button
            onClick={() => setActiveAdminTab('config')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeAdminTab === 'config' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Config Center
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="google-card shadow-elevation1 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Economy Users</span>
                <h4 className="text-2xl font-black text-white mt-1">{allUsers.length} Peers</h4>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>

            <div className="google-card shadow-elevation1 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Tokens Circulating</span>
                <h4 className="text-2xl font-black text-white mt-1">{totalEconomyTokens}</h4>
              </div>
              <Coins className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>

            <div className="google-card shadow-elevation1 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Available Courses</span>
                <h4 className="text-2xl font-black text-white mt-1">{skills.length} listed</h4>
              </div>
              <BookOpen className="w-8 h-8 text-accent" />
            </div>

            <div className="google-card shadow-elevation1 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">System Flags</span>
                <h4 className="text-xs font-black text-white mt-1.5 uppercase leading-relaxed">
                  Regs: {config.registrationLocked ? 'Locked' : 'Open'}<br />
                  Maint: {config.maintenanceMode ? 'Locked' : 'Online'}
                </h4>
              </div>
              <AlertOctagon className="w-8 h-8 text-red-400" />
            </div>
          </div>

          {/* Ledger distributing widget */}
          <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-textPrimary text-base flex items-center">
              <Plus className="w-5 h-5 text-emerald-400 mr-2" />
              Manual Token Distribution
            </h3>
            <p className="text-textSecondary text-xs leading-relaxed">
              Mint new tokens directly into a chosen contributor's balance. This simulates awards for bug fixes or documentation additions.
            </p>

            {distSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold">
                {distSuccess}
              </div>
            )}
            {distError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs font-bold">
                {distError}
              </div>
            )}

            <form onSubmit={handleDistributeSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-bold text-textSecondary">
              <div className="space-y-1">
                <label className="uppercase">Target Recipient</label>
                <select 
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-3 text-textPrimary focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose User --</option>
                  {allUsers.map((u, idx) => (
                    <option key={idx} value={u.identifier}>{u.name} ({u.identifier})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="uppercase">Token Amount (Mint)</label>
                <input 
                  type="number" 
                  value={distAmt}
                  onChange={(e) => setDistAmt(Number(e.target.value))}
                  className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-3 text-textPrimary focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2 flex flex-col justify-between">
                <label className="uppercase">Reason / Memo Description</label>
                <div className="flex space-x-2 w-full">
                  <input 
                    type="text" 
                    value={distReason}
                    onChange={(e) => setDistReason(e.target.value)}
                    placeholder="e.g. Added creative issue template"
                    className="flex-grow bg-bg border border-primary/10 rounded-xl px-4 py-3 text-textPrimary focus:border-emerald-500 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-glow transition-all"
                  >
                    Distribute
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* USER TAB */}
      {activeAdminTab === 'users' && (
        <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4 animate-fade-in">
          <h2 className="text-xl font-black text-textPrimary">User Directory Panel</h2>
          <p className="text-textSecondary text-xs">
            Review registration status and manage suspension states of active users.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-textSecondary font-semibold">
              <thead>
                <tr className="border-b border-primary/10 text-[10px] text-textPrimary uppercase tracking-wider">
                  <th className="py-3 px-4">Peer Student</th>
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u, idx) => (
                  <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-2 text-textPrimary font-extrabold">
                      <img src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt={u.name} className="w-7 h-7 rounded-full border border-primary/15" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4">{u.identifier}</td>
                    <td className="py-3 px-4 font-black text-textPrimary">{u.tokens} Tokens</td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] uppercase px-2 py-0.5 border rounded-full font-bold ${
                        u.status === 'suspended' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.identifier, u.status)}
                        className={`inline-flex items-center space-x-1 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors border ${
                          u.status === 'suspended' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {u.status === 'suspended' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Unsuspend</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            <span>Suspend User</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {activeAdminTab === 'skills' && (
        <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4 animate-fade-in">
          <h2 className="text-xl font-black text-textPrimary">Published Skill Directory</h2>
          <p className="text-textSecondary text-xs">
            Review or remove current digital courses listed inside the platform database.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(sk => (
              <div 
                key={sk.id} 
                className="bg-bg border border-primary/10 rounded-2xl p-4 flex justify-between items-start gap-4 text-xs font-semibold"
              >
                <div className="space-y-1 truncate">
                  <span className="text-[9px] uppercase bg-primary/15 border border-primary/10 text-primary-light px-2 py-0.5 rounded-full font-bold">
                    {sk.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-textPrimary mt-1 truncate">{sk.name}</h4>
                  <div className="flex space-x-4 text-textSecondary text-[10px] mt-1">
                    <span>👤 Teacher: {sk.teacher}</span>
                    <span>💰 Cost: {sk.tokens} Tokens</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteSkill(sk.id, sk.name)}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIG CENTER TAB */}
      {activeAdminTab === 'config' && (
        <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-textPrimary">System Flag Configurations</h2>
            <p className="text-textSecondary text-xs">
              Toggle global controls regulating access to platform functionalities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-textSecondary">
            {/* Registration Locked flag */}
            <div className="bg-bg border border-primary/10 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1 max-w-xs">
                <h4 className="text-textPrimary text-sm font-extrabold">Lock User Registration</h4>
                <p className="text-[10px] font-medium text-textSecondary leading-relaxed">
                  Temporarily disable new registrations. Existing peers can still sign in and trade.
                </p>
              </div>
              <button 
                onClick={() => updateConfig({ registrationLocked: !config.registrationLocked })}
                className={`w-14 h-8 rounded-full transition-colors relative border ${
                  config.registrationLocked ? 'bg-red-500 border-red-600' : 'bg-primary/20 border-primary/30'
                }`}
              >
                <span className={`absolute top-1 w-5.5 h-5.5 bg-white rounded-full transition-transform ${
                  config.registrationLocked ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Maintenance mode flag */}
            <div className="bg-bg border border-primary/10 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1 max-w-xs">
                <h4 className="text-textPrimary text-sm font-extrabold">System Maintenance Mode</h4>
                <p className="text-[10px] font-medium text-textSecondary leading-relaxed">
                  Simulate maintenance screen warnings. (Does not lock active sandbox tabs).
                </p>
              </div>
              <button 
                onClick={() => updateConfig({ maintenanceMode: !config.maintenanceMode })}
                className={`w-14 h-8 rounded-full transition-colors relative border ${
                  config.maintenanceMode ? 'bg-red-500 border-red-600' : 'bg-primary/20 border-primary/30'
                }`}
              >
                <span className={`absolute top-1 w-5.5 h-5.5 bg-white rounded-full transition-transform ${
                  config.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Conversion rates */}
            <div className="bg-bg border border-primary/10 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-textPrimary text-sm font-extrabold">Token Value multiplier</h4>
                <p className="text-[10px] font-medium text-textSecondary leading-relaxed">
                  Set baseline exchange valuation factors. Adjust sliders to simulate inflation.
                </p>
              </div>
              
              <div className="flex justify-between items-center bg-bg2 p-3 rounded-xl border border-primary/10">
                <input 
                  type="range" 
                  min={1} 
                  max={50}
                  value={config.tokenConversionRate}
                  onChange={(e) => updateConfig({ tokenConversionRate: Number(e.target.value) })}
                  className="flex-grow accent-emerald-500 cursor-pointer"
                />
                <span className="w-16 text-right text-textPrimary font-black">{config.tokenConversionRate} pts</span>
              </div>
            </div>

            {/* Platform Fees */}
            <div className="bg-bg border border-primary/10 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-textPrimary text-sm font-extrabold">Platform Escrow Fee (%)</h4>
                <p className="text-[10px] font-medium text-textSecondary leading-relaxed">
                  Simulate commission cut for platform token escrow maintenance.
                </p>
              </div>
              
              <div className="flex justify-between items-center bg-bg2 p-3 rounded-xl border border-primary/10">
                <input 
                  type="range" 
                  min={0} 
                  max={25}
                  value={config.platformFee}
                  onChange={(e) => updateConfig({ platformFee: Number(e.target.value) })}
                  className="flex-grow accent-emerald-500 cursor-pointer"
                />
                <span className="w-16 text-right text-textPrimary font-black">{config.platformFee}% fee</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Admin;
