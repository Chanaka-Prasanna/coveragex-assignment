export interface Task {
  id: string; // Add id as required
  title: string;
  description: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TaskCreate {
  title: string;
  description: string;
  is_completed: boolean;
}

export interface FetchTasksResponse {
  success: boolean;
  data: Task[];
}
