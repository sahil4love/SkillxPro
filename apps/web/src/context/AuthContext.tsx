import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Skill, Transaction, Message, ClassSchedule } from '../types';

type AuthMethod = 'email' | 'mobile' | 'username';
type AccountStatus = 'active' | 'suspended';
type TransactionType = 'earn' | 'spend' | 'bonus' | 'distributed';
type ClassStatus = 'scheduled' | 'completed' | 'cancelled';

interface AdminUser extends User {
  role: 'super_admin';
  method: 'username';
}

interface PlatformConfig {
  maintenanceMode: boolean;
  registrationLocked: boolean;
  tokenConversionRate: number;
  platformFee: number;
}

/** Shared authentication, user, marketplace, and admin state exposed by AuthProvider. */
interface AuthContextType {
  /** Currently signed-in learner or teacher; null when logged out or an admin is active. */
  user: User | null;
  /** Active super-admin session used by the admin dashboard. */
  adminUser: AdminUser | null;
  /** All registered platform users persisted in localStorage. */
  allUsers: User[];
  /** Marketplace skills available for discovery and teaching. */
  skills: Skill[];
  /** Token ledger entries for users and admin distributions. */
  transactions: Transaction[];
  /** In-app teacher/student conversation messages. */
  messages: Message[];
  /** Scheduled classes and their current status. */
  schedules: ClassSchedule[];
  /** Runtime platform settings managed by the admin dashboard. */
  config: PlatformConfig;
  /** Sign in a user by identifier, or the super admin with username credentials. */
  login: (identifier: string, method: AuthMethod) => Promise<boolean>;
  /** Create a new learner account unless registration is locked. */
  register: (name: string, identifier: string, method: Exclude<AuthMethod, 'username'>) => Promise<void>;
  /** Clear the active user or admin session from state and localStorage. */
  logout: () => void;
  /** Merge profile changes into the active user and the persisted user list. */
  updateUser: (userData: Partial<User>) => void;
  /** Toggle a user between active and suspended states. */
  updateUserStatus: (identifier: string, status: AccountStatus) => void;
  /** Add an admin-issued token distribution to a user account. */
  distributeTokens: (identifier: string, amount: number, reason: string) => void;
  /** Record a token ledger entry, optionally for a specific user and balance. */
  addTransaction: (type: TransactionType, description: string, amount: number, userIdentifier?: string, customBalance?: number) => void;
  /** Publish a new skill with an auto-generated id. */
  addSkill: (skillData: Omit<Skill, 'id'>) => void;
  /** Remove a skill from the marketplace by id. */
  deleteSkill: (id: number) => void;
  /** Append a chat message for a teacher conversation. */
  sendMessage: (teacher: string, text: string, sender: Message['sender']) => void;
  /** Create a scheduled class entry for a teacher and skill. */
  scheduleClass: (teacher: string, skillName: string, date: string, time: string) => void;
  /** Update the lifecycle status for a scheduled class. */
  updateClassStatus: (id: ClassSchedule['id'], status: ClassStatus) => void;
  /** Merge admin platform setting changes into the current config. */
  updateConfig: (newConfig: Partial<PlatformConfig>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default skills mock data
const DEFAULT_SKILLS: Skill[] = [
  { id: 1, name: 'UI/UX Design with Figma', category: 'Design', teacher: 'Sarah Jenkins', tokens: 40, rating: 4.9, students: 124, description: 'Learn visual design principles, component building, and interactive prototyping in Figma.', level: 'Beginner', hoursTaught: 18, created: '2026-01-15' },
  { id: 2, name: 'React & TypeScript Mastery', category: 'Development', teacher: 'David Chen', tokens: 60, rating: 4.8, students: 98, description: 'Build scalable modern SPAs with React, TypeScript, state management, and custom hooks.', level: 'Advanced', hoursTaught: 34, created: '2026-02-10' },
  { id: 3, name: 'Python for Data Analysis', category: 'Data Science', teacher: 'Alex Mercer', tokens: 50, rating: 4.7, students: 85, description: 'Get started with NumPy, Pandas, and Matplotlib to analyze and visualize raw data.', level: 'Intermediate', hoursTaught: 24, created: '2026-03-01' },
  { id: 4, name: 'Creative Writing & Storytelling', category: 'Writing', teacher: 'Elena Rostova', tokens: 30, rating: 4.9, students: 64, description: 'Explore character arcs, plot architecture, and expressive language in narrative writing.', level: 'Beginner', hoursTaught: 12, created: '2026-03-20' },
  { id: 5, name: 'Advanced CSS and Tailwind CSS', category: 'Design', teacher: 'Sarah Jenkins', tokens: 35, rating: 4.6, students: 48, description: 'Master flexbox, grid, transforms, transitions, and writing clean tailwind styles.', level: 'Intermediate', hoursTaught: 10, created: '2026-04-05' },
  { id: 6, name: 'Intro to Product Management', category: 'Business', teacher: 'Marcus Aurelius', tokens: 45, rating: 4.8, students: 56, description: 'Learn product roadmap planning, user story writing, and agile execution methodologies.', level: 'Beginner', hoursTaught: 15, created: '2026-04-12' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [config, setConfig] = useState({
    maintenanceMode: false,
    registrationLocked: false,
    tokenConversionRate: 10,
    platformFee: 5,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('swj_user');
      const storedAdmin = localStorage.getItem('swj_admin');
      const storedUsersList = localStorage.getItem('swj_all_users');
      const storedSkills = localStorage.getItem('swj_skills');
      const storedTx = localStorage.getItem('swj_transactions');
      const storedMsgs = localStorage.getItem('swj_messages');
      const storedSchedules = localStorage.getItem('swj_schedules');
      const storedConfig = localStorage.getItem('swj_config');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAdmin) setAdminUser(JSON.parse(storedAdmin));
      
      // Load or initialize users list
      if (storedUsersList) {
        setAllUsers(JSON.parse(storedUsersList));
      } else {
        const initialUsers: User[] = [
          { name: 'Sarah Jenkins', identifier: 'sarah@gmail.com', method: 'email', tokens: 350, joinedAt: '2026-01-10T12:00:00Z', status: 'active', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', skillsToTeach: ['UI/UX Design with Figma', 'Advanced CSS and Tailwind CSS'], skillsToLearn: ['React & TypeScript Mastery'], about: 'Product Designer at TechCorp. Love sharing visual design tips!' },
          { name: 'David Chen', identifier: 'david@gmail.com', method: 'email', tokens: 420, joinedAt: '2026-01-22T09:30:00Z', status: 'active', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', skillsToTeach: ['React & TypeScript Mastery'], skillsToLearn: ['UI/UX Design with Figma'], about: 'Senior Frontend Developer. React and TypeScript enthusiast.' },
          { name: 'Alex Mercer', identifier: 'alex@gmail.com', method: 'email', tokens: 280, joinedAt: '2026-02-05T15:45:00Z', status: 'active', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', skillsToTeach: ['Python for Data Analysis'], skillsToLearn: ['Intro to Product Management'] },
        ];
        setAllUsers(initialUsers);
        localStorage.setItem('swj_all_users', JSON.stringify(initialUsers));
      }

      // Load or initialize skills
      if (storedSkills) {
        setSkills(JSON.parse(storedSkills));
      } else {
        setSkills(DEFAULT_SKILLS);
        localStorage.setItem('swj_skills', JSON.stringify(DEFAULT_SKILLS));
      }

      // Load or initialize transactions
      if (storedTx) {
        setTransactions(JSON.parse(storedTx));
      } else {
        const initialTx: Transaction[] = [
          { date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'bonus', description: 'Platform Welcome Bonus', amount: 200, balance: 200 },
        ];
        setTransactions(initialTx);
        localStorage.setItem('swj_transactions', JSON.stringify(initialTx));
      }

      // Load or initialize messages
      if (storedMsgs) {
        setMessages(JSON.parse(storedMsgs));
      } else {
        const initialMsgs: Message[] = [
          { id: 1, sender: 'them', teacher: 'Sarah Jenkins', text: 'Hi! Welcome to SkillxPro. Let me know when you are free for the Figma class!', date: new Date(Date.now() - 3600000 * 2).toISOString() },
        ];
        setMessages(initialMsgs);
        localStorage.setItem('swj_messages', JSON.stringify(initialMsgs));
      }

      // Load or initialize schedules
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      } else {
        const initialSchedules: ClassSchedule[] = [];
        setSchedules(initialSchedules);
        localStorage.setItem('swj_schedules', JSON.stringify(initialSchedules));
      }

      // Load or initialize config
      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }
    } catch (e) {
      console.error('Failed to load localStorage', e);
    }
  }, []);

  // Actions
  const login = async (identifier: string, method: 'email' | 'mobile' | 'username'): Promise<boolean> => {
    // Check for super admin login credentials
    if (method === 'username' && identifier.toLowerCase() === 'admin') {
      const admin = {
        id: 'admin_001',
        name: 'Super Admin',
        identifier: 'admin',
        method: 'username' as const,
        tokens: 999999,
        joinedAt: new Date().toISOString(),
        role: 'super_admin' as const,
        status: 'active' as const
      };
      setAdminUser(admin);
      setUser(null);
      localStorage.setItem('swj_admin', JSON.stringify(admin));
      localStorage.removeItem('swj_user');
      return true;
    }

    // Regular user login
    let existingUser = allUsers.find(u => u.identifier.toLowerCase() === identifier.toLowerCase());

    if (existingUser) {
      if (existingUser.status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact support.');
      }
      setUser(existingUser);
      setAdminUser(null);
      localStorage.setItem('swj_user', JSON.stringify(existingUser));
      localStorage.removeItem('swj_admin');
      return true;
    } else {
      // Create user auto if email looks fine
      const newUser: User = {
        name: identifier.split('@')[0] || 'User',
        identifier,
        method,
        tokens: 150, // standard login award
        joinedAt: new Date().toISOString(),
        role: 'user',
        status: 'active',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${identifier}`,
        isPendingOTP: method === 'email' || method === 'mobile'
      };
      
      const updatedUsersList = [...allUsers, newUser];
      setAllUsers(updatedUsersList);
      localStorage.setItem('swj_all_users', JSON.stringify(updatedUsersList));
      
      setUser(newUser);
      setAdminUser(null);
      localStorage.setItem('swj_user', JSON.stringify(newUser));
      localStorage.removeItem('swj_admin');

      // Write welcome transaction
      const welcomeTx: Transaction = {
        date: new Date().toISOString(),
        type: 'bonus',
        description: 'New Device Registration Bonus',
        amount: 150,
        balance: 150,
        user: identifier
      };
      const storedTx = localStorage.getItem('swj_transactions');
      const txs = storedTx ? JSON.parse(storedTx) : [];
      const updatedTxs = [welcomeTx, ...txs];
      setTransactions(updatedTxs);
      localStorage.setItem('swj_transactions', JSON.stringify(updatedTxs));

      return true;
    }
  };

  const register = async (name: string, identifier: string, method: 'email' | 'mobile') => {
    if (config.registrationLocked) {
      throw new Error('Platform registration is currently locked by the administrator.');
    }

    const exists = allUsers.some(u => u.identifier.toLowerCase() === identifier.toLowerCase());
    if (exists) {
      throw new Error('An account with this identifier already exists.');
    }

    const newUser: User = {
      name,
      identifier,
      method,
      tokens: 200, // 200 welcome bonus for registration
      joinedAt: new Date().toISOString(),
      role: 'user',
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      isPendingOTP: true // Requires verify email OTP flow
    };

    const updatedUsersList = [...allUsers, newUser];
    setAllUsers(updatedUsersList);
    localStorage.setItem('swj_all_users', JSON.stringify(updatedUsersList));

    setUser(newUser);
    setAdminUser(null);
    localStorage.setItem('swj_user', JSON.stringify(newUser));
    localStorage.removeItem('swj_admin');

    // Create bonus transaction
    const bonusTx: Transaction = {
      date: new Date().toISOString(),
      type: 'bonus',
      description: 'Platform Welcome Bonus',
      amount: 200,
      balance: 200,
      user: identifier
    };
    
    const storedTx = localStorage.getItem('swj_transactions');
    const txs = storedTx ? JSON.parse(storedTx) : [];
    const updatedTxs = [bonusTx, ...txs];
    setTransactions(updatedTxs);
    localStorage.setItem('swj_transactions', JSON.stringify(updatedTxs));
  };

  const logout = () => {
    setUser(null);
    setAdminUser(null);
    localStorage.removeItem('swj_user');
    localStorage.removeItem('swj_admin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('swj_user', JSON.stringify(updatedUser));

    // Also update in allUsers list
    const updatedUsersList = allUsers.map(u => 
      u.identifier.toLowerCase() === user.identifier.toLowerCase() ? { ...u, ...userData } : u
    );
    setAllUsers(updatedUsersList);
    localStorage.setItem('swj_all_users', JSON.stringify(updatedUsersList));
  };

  const updateUserStatus = (identifier: string, status: 'active' | 'suspended') => {
    const updatedUsersList = allUsers.map(u => 
      u.identifier.toLowerCase() === identifier.toLowerCase() ? { ...u, status } : u
    );
    setAllUsers(updatedUsersList);
    localStorage.setItem('swj_all_users', JSON.stringify(updatedUsersList));

    // If the active user was suspended, log them out or trigger update
    if (user && user.identifier.toLowerCase() === identifier.toLowerCase()) {
      if (status === 'suspended') {
        logout();
      } else {
        setUser(prev => prev ? { ...prev, status } : null);
      }
    }
  };

  const distributeTokens = (identifier: string, amount: number, reason: string) => {
    const targetUser = allUsers.find(u => u.identifier.toLowerCase() === identifier.toLowerCase());
    if (!targetUser) return;

    const newBalance = targetUser.tokens + amount;

    const updatedUsersList = allUsers.map(u => 
      u.identifier.toLowerCase() === identifier.toLowerCase() ? { ...u, tokens: newBalance } : u
    );
    setAllUsers(updatedUsersList);
    localStorage.setItem('swj_all_users', JSON.stringify(updatedUsersList));

    if (user && user.identifier.toLowerCase() === identifier.toLowerCase()) {
      const updatedUser = { ...user, tokens: newBalance };
      setUser(updatedUser);
      localStorage.setItem('swj_user', JSON.stringify(updatedUser));
    }

    addTransaction('distributed', `Admin distribution: ${reason}`, amount, identifier, newBalance);
  };

  const addTransaction = (type: 'earn' | 'spend' | 'bonus' | 'distributed', description: string, amount: number, userIdentifier?: string, customBalance?: number) => {
    const currentIdentifier = userIdentifier || user?.identifier || 'system';
    
    // Get target balance
    let currentBalance = 0;
    if (customBalance !== undefined) {
      currentBalance = customBalance;
    } else if (currentIdentifier === user?.identifier) {
      currentBalance = user.tokens;
    } else {
      const targetUser = allUsers.find(u => u.identifier.toLowerCase() === currentIdentifier.toLowerCase());
      currentBalance = targetUser?.tokens || 0;
    }

    const newTx: Transaction = {
      date: new Date().toISOString(),
      type,
      description,
      amount,
      balance: currentBalance,
      user: currentIdentifier
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('swj_transactions', JSON.stringify(updatedTxs));
  };

  const addSkill = (skillData: Omit<Skill, 'id'>) => {
    const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
    const newSkill: Skill = {
      id: newId,
      ...skillData,
      rating: 5.0,
      students: 0,
      hoursTaught: 0,
      created: new Date().toISOString().split('T')[0]
    };

    const updatedSkills = [newSkill, ...skills];
    setSkills(updatedSkills);
    localStorage.setItem('swj_skills', JSON.stringify(updatedSkills));
  };

  const deleteSkill = (id: number) => {
    const updatedSkills = skills.filter(s => s.id !== id);
    setSkills(updatedSkills);
    localStorage.setItem('swj_skills', JSON.stringify(updatedSkills));
  };

  const sendMessage = (teacher: string, text: string, sender: 'you' | 'them') => {
    const newMsg: Message = {
      id: Date.now(),
      sender,
      teacher,
      text,
      date: new Date().toISOString()
    };

    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    localStorage.setItem('swj_messages', JSON.stringify(updatedMsgs));
  };

  const scheduleClass = (teacher: string, skillName: string, date: string, time: string) => {
    const newSchedule: ClassSchedule = {
      id: Date.now(),
      teacher,
      skillName,
      date,
      time,
      status: 'scheduled'
    };

    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    localStorage.setItem('swj_schedules', JSON.stringify(updatedSchedules));
  };

  const updateClassStatus = (id: string | number, status: 'scheduled' | 'completed' | 'cancelled') => {
    const updatedSchedules = schedules.map(s => 
      s.id === id ? { ...s, status } : s
    );
    setSchedules(updatedSchedules);
    localStorage.setItem('swj_schedules', JSON.stringify(updatedSchedules));
  };

  const updateConfig = (newConfig: Partial<AuthContextType['config']>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('swj_config', JSON.stringify(updatedConfig));
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminUser,
      allUsers,
      skills,
      transactions,
      messages,
      schedules,
      config,
      login,
      register,
      logout,
      updateUser,
      updateUserStatus,
      distributeTokens,
      addTransaction,
      addSkill,
      deleteSkill,
      sendMessage,
      scheduleClass,
      updateClassStatus,
      updateConfig
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
