"use client";

import { Task } from "@/types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  return (
    <div className="pl-10 w-xl">
      <div className="space-y-5 py-6 max-w-xl">
        {isLoading ? (
          <div
            className="flex justify-center py-10"
            aria-busy="true"
            aria-live="polite"
            data-testid="loading-spinner"
          >
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks to display.</p>
        ) : (
          tasks
            .slice(0, 5)
            .map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
        )}
      </div>
    </div>
  );
}
