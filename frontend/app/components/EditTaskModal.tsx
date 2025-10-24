"use client";

import { Task } from "@/types";
import { INPUT_LENGTHS } from "@/utils/constants";
import { useState } from "react";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
}

export function EditTaskModal({
  task,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const validateInputs = () => {
    let isValid = true;
    setTitleError("");
    setDescriptionError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.trim().length < INPUT_LENGTHS.MIN_TITLE_LENGTH) {
      setTitleError(
        `Title must be at least ${INPUT_LENGTHS.MIN_TITLE_LENGTH} characters`
      );
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (
      description.trim().length < INPUT_LENGTHS.MIN_DESCRIPTION_LENGTH
    ) {
      setDescriptionError(
        `Description must be at least ${INPUT_LENGTHS.MIN_DESCRIPTION_LENGTH} characters`
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (validateInputs()) {
      await onSave(title.trim(), description.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-md max-w-[90vw] p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Task</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white ${
                titleError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter task title"
            />
            {titleError && (
              <p className="mt-1 text-sm text-red-600">{titleError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white resize-y ${
                descriptionError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter task description"
            />
            {descriptionError && (
              <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
            )}
          </div>
        </div>
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
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded text-white ${
              isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
