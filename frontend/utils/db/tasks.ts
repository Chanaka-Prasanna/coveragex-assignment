import { FetchTasksResponse, Task } from "@/types";
import { URLS } from "../constants";
import {
  RequestError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../errors";

export const fetachTasks = async (): Promise<FetchTasksResponse> => {
  try {
    const response = await fetch(URLS.FETCH_TASKS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(
          "Tasks not found",
          `Status: ${response.status}`
        );
      } else if (response.status === 403) {
        throw new ForbiddenError(
          "Access to tasks is forbidden",
          `Status: ${response.status}`
        );
      } else {
        throw new RequestError(
          "Network response was not successful",
          `Status: ${response.status}`
        );
      }
    }
    const data = await response.json();
    console.log("Fetched tasks:", data);
    return { success: true, data };
  } catch (error) {
    if (
      error instanceof RequestError ||
      error instanceof NotFoundError ||
      error instanceof ForbiddenError
    ) {
      throw error;
    }
    throw new RequestError(
      `Failed to fetch tasks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const createTask = async (task: Task) => {
  try {
    if (!task || !task.title) {
      throw new ValidationError("Task title is required");
    }
    const response = await fetch(URLS.CREATE_TASK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw new ForbiddenError(
          "Access to create task is forbidden",
          `Status: ${response.status}`
        );
      } else if (response.status === 422) {
        throw new ValidationError(
          "Validation failed for task creation",
          `Status: ${response.status}`
        );
      } else {
        throw new RequestError(
          "Network response was not successful",
          `Status: ${response.status}`
        );
      }
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (
      error instanceof RequestError ||
      error instanceof ValidationError ||
      error instanceof ForbiddenError
    ) {
      throw error;
    }
    throw new RequestError(
      `Failed to create task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateTask = async (task: Partial<Task>) => {
  try {
    const { id, ...rest } = task;
    if (!id) {
      throw new ValidationError("Task id is required to update a task");
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
      if (response.status === 404) {
        throw new NotFoundError(
          "Task not found for update",
          `Status: ${response.status}`
        );
      } else if (response.status === 403) {
        throw new ForbiddenError(
          "Access to update task is forbidden",
          `Status: ${response.status}`
        );
      } else if (response.status === 422) {
        throw new ValidationError(
          "Validation failed for task update",
          `Status: ${response.status}`
        );
      } else {
        throw new RequestError(
          "Network response was not successful",
          `Status: ${response.status}`
        );
      }
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (
      error instanceof RequestError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof ForbiddenError
    ) {
      throw error;
    }
    throw new RequestError(
      `Failed to update task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteTask = async (id: string) => {
  try {
    if (!id) {
      throw new ValidationError("Task id is required to delete a task");
    }
    const response = await fetch(`${URLS.DELETE_TASK(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(
          "Task not found for deletion",
          `Status: ${response.status}`
        );
      } else if (response.status === 403) {
        throw new ForbiddenError(
          "Access to delete task is forbidden",
          `Status: ${response.status}`
        );
      } else {
        throw new RequestError(
          "Network response was not successful",
          `Status: ${response.status}`
        );
      }
    }
    return { success: true };
  } catch (error) {
    if (
      error instanceof RequestError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof ForbiddenError
    ) {
      throw error;
    }
    throw new RequestError(
      `Failed to delete task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
