export const URLS = {
  FETCH_TASKS: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`,
  CREATE_TASK: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`,
  GET_TASKS_BY_ID: (id: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${id}`,
  UPDATE_TASK: (task_id: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${task_id}`,
  DELETE_TASK: (task_id: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${task_id}`,
};
