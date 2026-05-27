import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skill } from '../types';
import { 
  BookOpen, Coins, MessageSquare, Settings, LayoutDashboard, Search, Plus, 
  ArrowUpRight, ArrowDownLeft, Award, Calendar, Send, 
  Star, Compass, Info
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    user, allUsers, skills, transactions, messages, schedules,
    updateUser, addTransaction, addSkill, sendMessage, scheduleClass, updateClassStatus, distributeTokens
  } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'marketplace';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Development');
  const [newSkillTokens, setNewSkillTokens] = useState(30);
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [skillAddedSuccess, setSkillAddedSuccess] = useState('');
  const [skillAddedError, setSkillAddedError] = useState('');

  const [purchaseAmt, setPurchaseAmt] = useState(100);
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const [activeTeacher, setActiveTeacher] = useState<string>('Sarah Jenkins');
  const [chatInput, setChatInput] = useState('');
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileAbout, setProfileAbout] = useState(user?.about || '');
  const [profileSkillsTeach, setProfileSkillsTeach] = useState<string>(user?.skillsToTeach?.join(', ') || '');
  const [profileSkillsLearn, setProfileSkillsLearn] = useState<string>(user?.skillsToLearn?.join(', ') || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [globalNotification, setGlobalNotification] = useState<string | null>(null);
  const triggerNotification = (msg: string) => {
    setGlobalNotification(msg);
    setTimeout(() => setGlobalNotification(null), 3500);
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileAbout(user.about || '');
      setProfileSkillsTeach(user.skillsToTeach?.join(', ') || '');
      setProfileSkillsLearn(user.skillsToLearn?.join(', ') || '');
    }
  }, [user]);

  // Categories list
  const categories = ['All', 'Development', 'Design', 'Data Science', 'Writing', 'Business'];

  // Handle Tab Navigation in URL
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // 1. Enroll inside a Skill
  const handleEnroll = (skill: Skill) => {
    if (!user) return;
    
    // Safety checks
    if (user.name.toLowerCase() === skill.teacher.toLowerCase()) {
      alert('You cannot enroll in your own skill!');
      return;
    }

    if (user.tokens < skill.tokens) {
      alert(`Insufficient Tokens! You need ${skill.tokens} tokens to enroll, but you only have ${user.tokens}.`);
      return;
    }

    const confirmEnroll = window.confirm(`Enroll inside "${skill.name}" for ${skill.tokens} tokens?`);
    if (!confirmEnroll) return;

    // Deduct tokens from user
    const newStudentBalance = user.tokens - skill.tokens;
    updateUser({ tokens: newStudentBalance });

    // Deduct transaction
    addTransaction('spend', `Enrolled in Course: "${skill.name}"`, skill.tokens, undefined, newStudentBalance);

    // Schedule automatic class session link
    scheduleClass(skill.teacher, skill.name, new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], '14:00');

    // Add tokens to teacher
    const teacherUser = allUsers.find(u => u.name.toLowerCase() === skill.teacher.toLowerCase());
    if (teacherUser) {
      distributeTokens(teacherUser.identifier, skill.tokens, `Teaching fee: Enrolled in "${skill.name}"`);
    }

    // Set message conversation and switch tab to schedule or talk
    setActiveTeacher(skill.teacher);
    sendMessage(skill.teacher, `Hello! I just enrolled inside your class "${skill.name}". Let's schedule a session!`, 'you');
    
    triggerNotification(`Successfully enrolled in "${skill.name}"!`);
    
    // Simulate auto-message from teacher after 1.5s
    setTimeout(() => {
      sendMessage(
        skill.teacher, 
        `Hey there! Super excited to teach you "${skill.name}". I have scheduled our first session for 2 days from now. Let me know if that time works!`, 
        'them'
      );
    }, 1500);

    setTab('chat');
  };

  // 2. Publish New Skill
  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSkillAddedSuccess('');
    setSkillAddedError('');

    if (!newSkillName.trim()) { setSkillAddedError('Skill name is required.'); return; }
    if (!newSkillDesc.trim()) { setSkillAddedError('Description is required.'); return; }

    addSkill({
      name: newSkillName,
      category: newSkillCat,
      teacher: user?.name || 'Instructor',
      tokens: Number(newSkillTokens),
      level: newSkillLevel,
      description: newSkillDesc
    });

    // Update user taught skills list
    const currentTeach = user?.skillsToTeach || [];
    if (!currentTeach.includes(newSkillName)) {
      updateUser({ skillsToTeach: [...currentTeach, newSkillName] });
    }

    setSkillAddedSuccess(`✓ Successfully published skill "${newSkillName}"!`);
    setNewSkillName('');
    setNewSkillDesc('');
    setNewSkillTokens(30);
  };

  // 3. Simulated Token Purchases
  const handlePurchaseTokens = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseSuccess('');
    
    if (!user) return;
    
    const newBal = user.tokens + Number(purchaseAmt);
    updateUser({ tokens: newBal });
    
    // Log in ledger
    addTransaction('bonus', `Sandbox: Simulated Token Purchase Package`, Number(purchaseAmt), undefined, newBal);
    
    setPurchaseSuccess(`✓ Sandbox: Loaded ${purchaseAmt} tokens to your ledger!`);
    triggerNotification(`Simulated purchase of ${purchaseAmt} tokens complete.`);
  };

  // 4. Send Chat message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMessage(activeTeacher, chatInput, 'you');
    setChatInput('');

    // Simulate auto reply from teacher based on context
    setTimeout(() => {
      const replies = [
        "Sounds good! Let's lock that slot down.",
        "Perfect, looking forward to our collaborative jig session!",
        "Understood. Let's make sure we review the prerequisites before class.",
        "Awesome! Let me know if you want to invite other learners to our group chat."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      sendMessage(activeTeacher, randomReply, 'them');
    }, 2000);
  };

  // 5. Custom Schedule class from chat inbox
  const handleCustomSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;

    scheduleClass(activeTeacher, 'Custom Mentorship Slot', scheduleDate, scheduleTime);
    sendMessage(activeTeacher, `📅 Proposed a new schedule slot for ${scheduleDate} at ${scheduleTime}.`, 'you');
    
    setShowScheduleModal(false);
    setScheduleDate('');
    setScheduleTime('');
    triggerNotification('Simulated class schedule invite sent.');
  };

  // 6. Complete / Cancel Class
  const handleClassStateChange = (id: string | number, state: 'completed' | 'cancelled', teacher: string, fee: number) => {
    updateClassStatus(id, state);
    if (state === 'completed') {
      triggerNotification('Congratulations on completing the class session!');
      // Write transaction bonus
      if (user?.name === teacher) {
        addTransaction('earn', 'Completed teaching custom session', fee, undefined, user.tokens + fee);
      }
    } else {
      triggerNotification('Class session has been cancelled.');
    }
  };

  // 7. Profile Updates
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');

    const teachArr = profileSkillsTeach.split(',').map(s => s.trim()).filter(Boolean);
    const learnArr = profileSkillsLearn.split(',').map(s => s.trim()).filter(Boolean);

    updateUser({
      name: profileName,
      about: profileAbout,
      skillsToTeach: teachArr,
      skillsToLearn: learnArr
    });

    setProfileSuccess('✓ Profile data updated successfully!');
    triggerNotification('Profile details synced.');
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || skill.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* Toast Notification */}
      {globalNotification && (
        <div className="fixed bottom-6 right-6 bg-primary border border-primary/20 text-white font-bold px-6 py-4 rounded-2xl shadow-glow z-50 animate-bounce flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-400 animate-spin" />
          <span>{globalNotification}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* User Widget */}
          <div className="google-card shadow-elevation1 rounded-3xl p-6 text-center space-y-4">
            <div className="relative inline-block">
              <img 
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                alt={user?.name} 
                className="w-20 h-20 rounded-full border-2 border-primary/30 mx-auto shadow-glow"
              />
              <span className="absolute bottom-0 right-1 w-4 h-4 bg-accent border-2 border-bg2 rounded-full" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-textPrimary text-base">{user?.name}</h3>
              <p className="text-textSecondary text-[10px] uppercase font-bold tracking-widest">{user?.identifier}</p>
            </div>

            <div className="bg-bg border border-primary/10 rounded-2xl p-4 flex justify-between items-center text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Account Balance</span>
                <div className="text-lg font-black text-white flex items-center">
                  <Coins className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                  <span>{user?.tokens} Tokens</span>
                </div>
              </div>
              <button 
                onClick={() => setTab('tokens')}
                className="p-2 bg-primary/10 border border-primary/20 hover:border-primary/50 rounded-xl text-primary-light transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav List Menu */}
          <div className="google-card shadow-elevation1 rounded-3xl p-4 space-y-1">
            <button
              onClick={() => setTab('marketplace')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                activeTab === 'marketplace' ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center"><Compass className="w-4 h-4 mr-3" /> Skill Marketplace</span>
              <span className="text-[10px] font-black uppercase bg-primary/20 text-primary-light px-2 py-0.5 rounded-full">Explore</span>
            </button>
            
            <button
              onClick={() => setTab('myskills')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                activeTab === 'myskills' ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center"><BookOpen className="w-4 h-4 mr-3" /> My Skill Exchange</span>
              <span className="text-xs font-semibold">{user?.skillsToTeach?.length || 0} taught</span>
            </button>

            <button
              onClick={() => setTab('chat')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                activeTab === 'chat' ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-3" /> Direct Chat Hub</span>
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            </button>

            <button
              onClick={() => setTab('tokens')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                activeTab === 'tokens' ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center"><Coins className="w-4 h-4 mr-3" /> Ledger & Sandbox</span>
              <span className="text-xs font-semibold text-accent">+{transactions.length} txs</span>
            </button>

            <button
              onClick={() => setTab('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                activeTab === 'settings' ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
              }`}
            >
              <Settings className="w-4 h-4 mr-3" /> Settings & Profile
            </button>
          </div>

        </div>

        {/* Content Console Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Filter card */}
              <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4">
                <h2 className="text-xl font-black text-textPrimary">Exchange Marketplace</h2>
                <p className="text-textSecondary text-xs leading-relaxed">
                  Search active skills listed by our community peers. Unlock lessons using your collaborative tokens.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-textTertiary" />
                    <input 
                      type="text" 
                      placeholder="Search courses, skills, teachers..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-bg border border-primary/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-primary/40 focus:outline-none text-textPrimary"
                    />
                  </div>
                  
                  {/* Category sliders */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {categories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCategoryFilter(cat)}
                        className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                          categoryFilter === cat 
                            ? 'bg-primary/20 border-primary text-primary-light font-black' 
                            : 'bg-bg border-primary/5 text-textSecondary hover:text-textPrimary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <div 
                      key={skill.id} 
                      className="google-card google-card-hover rounded-3xl p-6 flex flex-col justify-between relative group"
                    >
                      <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-black bg-primary/15 text-primary-light border border-primary/10 rounded-full px-2.5 py-0.5">
                            {skill.category}
                          </span>
                          <span className="text-xs font-semibold text-textSecondary flex items-center">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                            {skill.rating} ({skill.students} peers)
                          </span>
                        </div>

                        {/* Title */}
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-textPrimary text-base sm:text-lg group-hover:text-primary-light transition-colors">
                            {skill.name}
                          </h3>
                          <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                            {skill.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-primary/5 pt-4 mt-6 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${skill.teacher}`} 
                            alt={skill.teacher} 
                            className="w-8 h-8 rounded-full border border-primary/20 bg-bg"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-textSecondary block uppercase">Instructor</span>
                            <span className="text-xs font-bold text-textPrimary">{skill.teacher}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleEnroll(skill)}
                          className="flex items-center bg-gradient-to-r from-primary to-primary-light hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-glow space-x-1.5 transition-all"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>{skill.tokens} Tokens</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 google-card shadow-elevation1 rounded-3xl p-10 text-center text-textSecondary space-y-2">
                    <Info className="w-8 h-8 text-primary mx-auto animate-pulse" />
                    <h4 className="font-extrabold text-textPrimary">No skills found matching search criteria</h4>
                    <p className="text-xs max-w-sm mx-auto">Try clearing search values or adjusting the filter buttons.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: MY SKILLS */}
          {activeTab === 'myskills' && (
            <div className="space-y-6 animate-fade-in col-span-1">
              
              {/* Form publishing cards */}
              <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4">
                <h2 className="text-xl font-black text-textPrimary flex items-center">
                  <Plus className="w-5 h-5 text-primary mr-2" />
                  Publish a Skill to Teach
                </h2>
                <p className="text-textSecondary text-xs">
                  List your talent to teach. You earn tokens directly from peers when they enroll inside your course classes.
                </p>

                {skillAddedSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold">
                    {skillAddedSuccess}
                  </div>
                )}
                {skillAddedError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs font-bold">
                    {skillAddedError}
                  </div>
                )}

                <form onSubmit={handleAddSkillSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-textSecondary">Skill Course Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Photoshop Advanced Mockups" 
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-textSecondary">Category</label>
                    <select 
                      value={newSkillCat}
                      onChange={(e) => setNewSkillCat(e.target.value)}
                      className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                    >
                      {categories.filter(c => c !== 'All').map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-textSecondary">Token Fee Charged (10-100)</label>
                    <input 
                      type="number" 
                      min={10} 
                      max={100}
                      value={newSkillTokens}
                      onChange={(e) => setNewSkillTokens(Number(e.target.value))}
                      className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-textSecondary">Difficulty Level</label>
                    <select 
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as any)}
                      className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-textSecondary">Description & Syllabus</label>
                    <textarea 
                      placeholder="Detailed overview of what students will learn..."
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-bg border border-primary/10 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="md:col-span-2 bg-gradient-to-r from-primary to-primary-light text-white font-bold py-2.5 rounded-xl shadow-glow hover:opacity-95 transition-all text-xs"
                  >
                    Publish Course Offering
                  </button>
                </form>
              </div>

              {/* Class Schedules lists */}
              <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-textPrimary text-base flex items-center">
                  <Calendar className="w-5 h-5 text-accent mr-2" />
                  Your Scheduled Class Checkpoints
                </h3>

                <div className="space-y-3">
                  {schedules.length > 0 ? (
                    schedules.map(sch => (
                      <div 
                        key={sch.id} 
                        className="bg-bg border border-primary/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest block">Course Class</span>
                          <span className="text-sm font-extrabold text-textPrimary">{sch.skillName}</span>
                          <div className="flex space-x-4 text-textSecondary text-[10px]">
                            <span>👤 Teacher: {sch.teacher}</span>
                            <span>📅 Date: {sch.date} at {sch.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {sch.status === 'scheduled' ? (
                            <>
                              <span className="text-[9px] uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5 animate-pulse">
                                Scheduled
                              </span>
                              <button 
                                onClick={() => handleClassStateChange(sch.id, 'completed', sch.teacher, 40)}
                                className="bg-accent/15 border border-accent/20 hover:bg-accent/25 text-accent rounded-lg px-2.5 py-1.5 transition-colors text-[10px]"
                              >
                                Log Completed
                              </button>
                              <button 
                                onClick={() => handleClassStateChange(sch.id, 'cancelled', sch.teacher, 0)}
                                className="bg-red-500/15 border border-red-500/20 hover:bg-red-500/25 text-red-400 rounded-lg px-2.5 py-1.5 transition-colors text-[10px]"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <span className={`text-[9px] uppercase rounded-full px-2.5 py-0.5 border ${
                              sch.status === 'completed' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                              {sch.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 text-textSecondary text-xs">
                      No current class schedules configured. Enroll in a class or schedule one inside the chat inbox panel.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CHAT HUB */}
          {activeTab === 'chat' && (
            <div className="google-card shadow-elevation2 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-fade-in">
              
              {/* Teachers Inbox Directory */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-primary/10 p-4 space-y-4">
                <h3 className="font-extrabold text-textPrimary text-sm uppercase tracking-wider">Inbox Contacts</h3>
                <div className="space-y-1">
                  {allUsers.filter(u => u.identifier.toLowerCase() !== user?.identifier.toLowerCase()).map((u, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTeacher(u.name)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-2xl text-left text-xs font-semibold transition-colors ${
                        activeTeacher === u.name ? 'bg-primary/20 text-primary-light border border-primary/10' : 'text-textSecondary hover:text-textPrimary hover:bg-primary/5'
                      }`}
                    >
                      <img src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt={u.name} className="w-8 h-8 rounded-full border border-primary/15" />
                      <div className="truncate">
                        <span className="font-bold text-textPrimary block">{u.name}</span>
                        <span className="text-[10px] text-textSecondary truncate block">{u.about || 'Peer instructor'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Header chat teacher details */}
                <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-bg/50">
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeTeacher}`} 
                      alt={activeTeacher} 
                      className="w-9 h-9 rounded-full border border-primary/25 bg-bg2"
                    />
                    <div>
                      <span className="font-extrabold text-textPrimary text-sm block">{activeTeacher}</span>
                      <span className="text-[10px] text-accent font-bold flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1 animate-pulse" />
                        Online (Peer Instructor)
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center bg-primary/15 border border-primary/25 hover:border-primary/50 rounded-xl px-3 py-1.5 text-xs text-primary-light font-bold transition-all shadow-glow"
                  >
                    <Calendar className="w-4 h-4 mr-1 text-primary-light" />
                    <span>Schedule Class</span>
                  </button>
                </div>

                {/* Messages ledger log */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[350px]">
                  {messages.filter(m => m.teacher === activeTeacher).length > 0 ? (
                    messages.filter(m => m.teacher === activeTeacher).map((msg, idx) => {
                      const isMe = msg.sender === 'you';
                      return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                            isMe ? 'bg-primary text-white rounded-tr-none shadow-glow' : 'bg-bg border border-primary/10 text-textPrimary rounded-tl-none'
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <span className="text-[8px] opacity-60 text-right block mt-1">
                              {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-textSecondary text-xs p-10 space-y-2">
                      <MessageSquare className="w-8 h-8 text-primary mx-auto animate-pulse" />
                      <h4 className="font-extrabold text-textPrimary">Send a direct invite message</h4>
                      <p className="max-w-xs mx-auto text-[10px]">Type a greeting to start coordinating your custom learning session.</p>
                    </div>
                  )}
                </div>

                {/* Send action footer */}
                <form onSubmit={handleSendChat} className="p-4 border-t border-primary/10 bg-bg/50 flex space-x-2">
                  <input 
                    type="text" 
                    placeholder={`Write a proposal message to ${activeTeacher}...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow bg-bg border border-primary/10 rounded-2xl px-4 py-3 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white p-3 rounded-2xl shadow-glow transition-all"
                  >
                    <Send className="w-4 h-4 fill-white" />
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* TAB 4: LEDGER & SANDBOX */}
          {activeTab === 'tokens' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Purchase sandbox widget */}
              <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-6">
                <h2 className="text-xl font-black text-textPrimary flex items-center">
                  <Coins className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
                  Token Sandbox Purchase
                </h2>
                
                <div className="bg-bg border border-primary/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">Sandbox Simulator Mode</span>
                    <h3 className="font-extrabold text-textPrimary text-sm">Need more tokens to enroll in active classes?</h3>
                    <p className="text-[10px] text-textSecondary leading-relaxed">
                      Simply select a simulation packet below. It will inject mock balances directly into your persistent browser storage ledger!
                    </p>
                  </div>

                  <form onSubmit={handlePurchaseTokens} className="flex flex-col justify-center items-stretch gap-2.5">
                    <select 
                      value={purchaseAmt}
                      onChange={(e) => setPurchaseAmt(Number(e.target.value))}
                      className="bg-bg2 border border-primary/15 rounded-xl px-4 py-2.5 text-xs text-textPrimary focus:border-primary focus:outline-none"
                    >
                      <option value={100}>100 Tokens (+ $0.00)</option>
                      <option value={250}>250 Tokens (+ $0.00)</option>
                      <option value={500}>500 Tokens (+ $0.00)</option>
                      <option value={1000}>1000 Tokens (+ $0.00)</option>
                    </select>

                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-glow transition-all"
                    >
                      Purchase simulated
                    </button>
                  </form>
                </div>
                
                {purchaseSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold">
                    {purchaseSuccess}
                  </div>
                )}
              </div>

              {/* Transactions Ledger log */}
              <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-textPrimary text-base flex items-center">
                  <LayoutDashboard className="w-5 h-5 text-primary mr-2" />
                  Simulated Transaction Ledger
                </h3>

                <div className="space-y-3">
                  {transactions.filter(t => t.user?.toLowerCase() === user?.identifier?.toLowerCase() || !t.user).map((tx, idx) => {
                    const isEarn = tx.type === 'earn' || tx.type === 'bonus' || tx.type === 'distributed';
                    return (
                      <div 
                        key={idx} 
                        className="bg-bg border border-primary/10 rounded-2xl p-4 flex justify-between items-center text-xs font-semibold"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className={`p-2.5 rounded-xl ${isEarn ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            {isEarn ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-extrabold text-textPrimary block text-sm sm:text-base">{tx.description}</span>
                            <span className="text-[10px] text-textSecondary block mt-0.5">{new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-base font-black ${isEarn ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isEarn ? '+' : '-'}{tx.amount} Tokens
                          </span>
                          <span className="text-[10px] text-textSecondary block mt-0.5">Balance: {tx.balance}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="google-card shadow-elevation1 rounded-3xl p-6 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-textPrimary">Profile Settings</h2>
                <p className="text-textSecondary text-xs leading-relaxed">
                  Update your bio info, skills you want to teach, and skills you want to learn.
                </p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold animate-fade-in">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">Display Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-bg border border-primary/10 rounded-2xl px-4 py-3 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">About Me Bio</label>
                  <textarea 
                    rows={4}
                    value={profileAbout}
                    onChange={(e) => setProfileAbout(e.target.value)}
                    placeholder="Short statement introducing your skills and custom learning goals..."
                    className="w-full bg-bg border border-primary/10 rounded-2xl px-4 py-3 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">Skills You Can Teach (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={profileSkillsTeach}
                    onChange={(e) => setProfileSkillsTeach(e.target.value)}
                    placeholder="e.g. Figma Designing, React Component Building"
                    className="w-full bg-bg border border-primary/10 rounded-2xl px-4 py-3 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textSecondary uppercase tracking-wide">Skills You Want to Learn (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={profileSkillsLearn}
                    onChange={(e) => setProfileSkillsLearn(e.target.value)}
                    placeholder="e.g. Python Scripting, Spanish Language"
                    className="w-full bg-bg border border-primary/10 rounded-2xl px-4 py-3 text-xs text-textPrimary focus:border-primary/45 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary-light text-white font-bold py-3 px-6 rounded-2xl shadow-glow hover:opacity-95 transition-all text-xs"
                >
                  Save Profile Configuration
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Class Schedulers Modal Box overlay */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md google-card shadow-elevation3 rounded-3xl p-6 animate-fade-in relative space-y-4">
            <button 
              onClick={() => setShowScheduleModal(false)}
              className="absolute right-4 top-4 text-textSecondary hover:text-textPrimary font-bold text-xs"
            >
              ✕
            </button>

            <h3 className="font-extrabold text-textPrimary text-base">Schedule Simulated Class</h3>
            <p className="text-textSecondary text-[10px] leading-relaxed">
              Define the date and time to lock in your next exchange lesson with {activeTeacher}.
            </p>

            <form onSubmit={handleCustomSchedule} className="space-y-4 text-xs font-bold text-textSecondary">
              <div className="space-y-1.5 col-span-2">
                <label className="uppercase tracking-wider">Select Day Date</label>
                <input 
                  type="date" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-bg border border-primary/15 rounded-xl px-4 py-2.5 text-textPrimary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="uppercase tracking-wider">Select Class Time Slot</label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-bg border border-primary/15 rounded-xl px-4 py-2.5 text-textPrimary focus:border-primary focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-light text-white font-bold py-2.5 rounded-xl shadow-glow transition-all"
              >
                Send Proposal Schedule
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
