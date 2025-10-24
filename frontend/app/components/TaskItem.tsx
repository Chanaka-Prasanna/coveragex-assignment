"use client";

import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md ${
        task.is_completed ? "opacity-75" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-blue-500/70 to-blue-600/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold tracking-tight mb-1 ${
              task.is_completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-sm leading-6 ${
              task.is_completed ? "text-gray-500" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              task.is_completed
                ? "border-gray-300 bg-gray-100 text-gray-700"
                : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            {task.is_completed ? "Completed" : "Done"}
          </button>
          <div className="flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Edit"
              aria-label="Edit task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path d="M16.862 3.487a1.75 1.75 0 0 1 2.475 2.475l-8.9 8.9a1.75 1.75 0 0 1-.739.437l-3.21.918a.5.5 0 0 1-.614-.614l.918-3.21c.092-.322.251-.618.468-.866l8.9-8.9z" />
                <path d="M5.25 7.5V6.75A2.75 2.75 0 0 1 8 4h8a2.75 2.75 0 0 1 2.75 2.75v8A2.75 2.75 0 0 1 16 17.5h-.75" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Delete"
              aria-label="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path d="M9.5 4.75h5a1 1 0 0 1 1 1V7h3.25M6.25 7H4m2.25 0h11.5M8 7l.88 11.44A2 2 0 0 0 10.87 20.5h2.26a2 2 0 0 0 1.99-2.06L16 7" />
                <path d="M10 10.5v6M14 10.5v6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
