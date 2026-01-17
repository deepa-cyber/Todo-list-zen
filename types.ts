
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  dueDate: string; // ISO format: YYYY-MM-DD
  isSynced?: boolean;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
}

export type AppView = 'tasks' | 'calendar' | 'stats';
