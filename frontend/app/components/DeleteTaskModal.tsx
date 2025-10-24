"use client";

import { Task } from "@/types";

interface DeleteTaskModalProps {
  task: Task;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteTaskModal({
  task,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-[24rem] max-w-[90vw] p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Delete Task
        </h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-800">{task.title}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 rounded text-white ${
              isDeleting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
