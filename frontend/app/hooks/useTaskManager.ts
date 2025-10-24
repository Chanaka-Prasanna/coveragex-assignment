"use client";

import { Task, TaskCreate } from "@/types";
import { useState } from "react";
import { ITaskService } from "../services/TaskService";

export function useTaskManager(taskService: ITaskService) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchTasks = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { success, data } = await taskService.fetchTasks();
      if (success) {
        setTasks(data.filter((task: Task) => !task.is_completed));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching tasks.";
      setErrorMessage(errorMessage);
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: TaskCreate) => {
    setErrorMessage("");
    try {
      await taskService.createTask(task);
      await fetchTasks();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating task.";
      setErrorMessage(errorMessage);
      console.error("Error creating task:", error);
      return false;
    }
  };

  const updateTask = async (task: Partial<Task>) => {
    setErrorMessage("");
    try {
      await taskService.updateTask(task);
      await fetchTasks();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error updating task.";
      setErrorMessage(errorMessage);
      console.error("Error updating task:", error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    setErrorMessage("");
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting task.";
      setErrorMessage(errorMessage);
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask({
        id,
        is_completed: !task.is_completed,
      });
    }
  };

  return {
    tasks,
    isLoading,
    errorMessage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };
}
