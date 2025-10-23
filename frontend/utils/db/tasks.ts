import { FetchTasksResponse, Task } from "@/types";
import { URLS } from "../constants";

export const fetachTasks = async (): Promise<FetchTasksResponse> => {
  try {
    const response = await fetch(URLS.FETCH_TASKS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not successful");
    }

    const data = await response.json();
    console.log("Fetched tasks:", data);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    throw new Error("Failed to fetch tasks: Unknown error");
  }
};

export const createTask = async (task: Task) => {
  try {
    const response = await fetch(URLS.CREATE_TASK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Network response was not successful");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
    throw new Error("Failed to create task: Unknown error");
  }
};

export const updateTask = async (task: Partial<Task>) => {
  try {
    const { id, ...rest } = task;
    if (!id) {
      throw new Error("Task id is required to update a task");
    }

    const payload = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined)
    );
    const response = await fetch(`${URLS.UPDATE_TASK(id!)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not successful");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
    throw new Error("Failed to update task: Unknown error");
  }
};
