"use client";

import { Task } from "@/types";
import { INPUT_LENGTHS } from "@/utils/constants";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (task: Task) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        is_completed: false,
      };
      await onSubmit(newTask);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="w-96 pr-10">
      <div className="py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-8">Add a Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 bg-white ${
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
              htmlFor="description"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 bg-white resize-y ${
                descriptionError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter task description"
            />
            {descriptionError && (
              <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
