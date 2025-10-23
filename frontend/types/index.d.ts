export interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

export interface TaskDoc extends Task {
  created_at?: string;
  updated_at?: string;
}

export interface FetchTasksResponse {
  success: boolean;
  data: Task[];
}
