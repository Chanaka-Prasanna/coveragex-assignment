"use client";

import { Task } from "@/types";
import {
  createTask,
  fetchTasks,
  updateTask,
  deleteTask,
} from "@/utils/db/tasks";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const validateInputs = () => {
    let isValid = true;
    setTitleError("");
    setDescriptionError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (description.trim().length < 15) {
      setDescriptionError("Description must be at least 15 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setTitleError("");
    setDescriptionError("");

    if (validateInputs()) {
      const newTask: Task = {
        id: uuidv4().toString(),
        title: title.trim(),
        description: description.trim(),
        is_completed: false,
      };
      try {
        await createTask(newTask);
        await fetchData();
        setTitle("");
        setDescription("");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Error creating task.";
        setErrorMessage(errorMessage);
        console.error("Error creating task:", error);
      }
    }
  };

  const handleToggleComplete = async (id: string) => {
    setErrorMessage("");
    try {
      await updateTask({
        id,
        is_completed: !tasks.find((task) => task.id === id)?.is_completed,
      });
      await fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error updating task.";
      setErrorMessage(errorMessage);
      console.error("Error updating task:", error);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const closeModals = () => {
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedTask(null);
    setEditTitle("");
    setEditDescription("");
    setIsSavingEdit(false);
    setIsDeleting(false);
  };

  const validateEditInputs = () => {
    let isValid = true;
    setTitleError("");
    setDescriptionError("");

    if (!editTitle.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (editTitle.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      isValid = false;
    }

    if (!editDescription.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (editDescription.trim().length < 15) {
      setDescriptionError("Description must be at least 15 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSaveEdit = async () => {
    if (!selectedTask) return;
    setErrorMessage("");
    if (!validateEditInputs()) return;
    try {
      setIsSavingEdit(true);
      await updateTask({
        id: selectedTask.id,
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      await fetchData();
      closeModals();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error saving task edits.";
      setErrorMessage(errorMessage);
      console.error("Error saving task edits:", error);
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask) return;
    setErrorMessage("");
    try {
      setIsDeleting(true);
      await deleteTask(selectedTask.id);
      await fetchData();
      closeModals();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting task.";
      setErrorMessage(errorMessage);
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { success, data } = await fetchTasks();
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

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {errorMessage && (
          <div className="mb-6 p-3 rounded bg-red-100 text-red-700 border border-red-300">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-center gap-0">
          {/* Left Side - Add Task Form */}
          <div className="w-96 pr-10">
            <div className="py-6">
              <h2 className="text-xl font-bold text-gray-800 mb-8">
                Add a Task
              </h2>
              <form onSubmit={handleAddTask} className="space-y-6">
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
                    <p className="mt-1 text-sm text-red-600">
                      {descriptionError}
                    </p>
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

          {/* Vertical Separator */}
          <div className="w-px bg-gray-300 mx-12 lg:mx-16"></div>

          {/* Right Side - Task List */}
          <div className="pl-10 w-xl">
            <div className="space-y-5 py-6 max-w-xl">
              {isLoading ? (
                <div
                  className="flex justify-center py-10"
                  aria-busy="true"
                  aria-live="polite"
                >
                  <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
                </div>
              ) : tasks.length === 0 && !isLoading ? (
                <p className="text-gray-500">No tasks to display.</p>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md ${
                      task.is_completed ? "opacity-75" : ""
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b from-blue-500/70 to-blue-600/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold tracking-tight mb-1 ${
                            task.is_completed
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p
                          className={`text-sm leading-6 ${
                            task.is_completed
                              ? "text-gray-500"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
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
                            onClick={() => openEditModal(task)}
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
                            onClick={() => openDeleteModal(task)}
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
                ))
              )}
            </div>
          </div>
          {/* Edit Modal */}
          {isEditOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white rounded-lg shadow-lg w-md max-w-[90vw] p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Task
                </h2>
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
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
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
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white resize-y ${
                        descriptionError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter task description"
                    />
                    {descriptionError && (
                      <p className="mt-1 text-sm text-red-600">
                        {descriptionError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className={`px-4 py-2 rounded text-white ${
                      isSavingEdit
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSavingEdit ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          {isDeleteOpen && (
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
                  <span className="font-medium text-gray-800">
                    {selectedTask?.title}
                  </span>
                  ?
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
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
          )}
        </div>
      </div>
    </div>
  );
}
