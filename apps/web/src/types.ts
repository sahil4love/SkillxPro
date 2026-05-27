export interface User {
  id?: string | number;
  name: string;
  identifier: string;
  method: 'email' | 'mobile' | 'username';
  tokens: number;
  joinedAt: string;
  role?: 'user' | 'super_admin';
  status?: 'active' | 'suspended';
  avatarUrl?: string;
  isPendingOTP?: boolean;
  hasSeenWelcome?: boolean;
  about?: string;
  skillsToTeach?: string[];
  skillsToLearn?: string[];
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  teacher: string;
  tokens: number;
  rating?: number;
  students?: number;
  description: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  hoursTaught?: number;
  created?: string;
}

export interface Transaction {
  date: string;
  type: 'earn' | 'spend' | 'bonus' | 'distributed';
  description: string;
  amount: number;
  balance: number;
  user?: string;
  reason?: string;
}

export interface Message {
  id?: string | number;
  sender: 'you' | 'them';
  teacher: string;
  text: string;
  date: string;
}

export interface ClassSchedule {
  id: string | number;
  teacher: string;
  skillName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
