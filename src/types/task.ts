export type TaskStatus = 'todo' | 'inProgress' | 'completed';
export type TaskCategoryColor = 'default' | 'brand' | 'success' | 'orange';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  comments?: number;
  assignee?: string; // photo URL or UID
  status: TaskStatus;
  category?: { name: string; color: TaskCategoryColor };
  links?: number;
  projectDesc?: string;
  projectImg?: string;
  grade?: string;
  sectionId?: string;
  subject?: string;
}