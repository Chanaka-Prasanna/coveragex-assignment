"use client";

import { Task, TaskCreate } from "@/types";
import { useEffect, useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { EditTaskModal } from "./components/EditTaskModal";
import { DeleteTaskModal } from "./components/DeleteTaskModal";
import { useTaskManager } from "./hooks/useTaskManager";
import { TaskService } from "./services/TaskService";

const taskService = new TaskService();

export default function Page() {
  const {
    tasks,
    isLoading,
    errorMessage,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTaskManager(taskService);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTask = async (task: TaskCreate) => {
    await createTask(task);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskComplete(id);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
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
    setIsSavingEdit(false);
    setIsDeleting(false);
  };

  const handleSaveEdit = async (title: string, description: string) => {
    if (!selectedTask) return;
    try {
      setIsSavingEdit(true);
      const success = await updateTask({
        id: selectedTask.id,
        title,
        description,
      });
      if (success) {
        closeModals();
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask) return;
    try {
      setIsDeleting(true);
      const success = await deleteTask(selectedTask.id);
      if (success) {
        closeModals();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
          <TaskForm onSubmit={handleAddTask} />
          <div className="w-px bg-gray-300 mx-12 lg:mx-16"></div>
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </div>

        {selectedTask && (
          <>
            <EditTaskModal
              task={selectedTask}
              isOpen={isEditOpen}
              isSaving={isSavingEdit}
              onClose={closeModals}
              onSave={handleSaveEdit}
            />
            <DeleteTaskModal
              task={selectedTask}
              isOpen={isDeleteOpen}
              isDeleting={isDeleting}
              onClose={closeModals}
              onConfirm={handleConfirmDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}
