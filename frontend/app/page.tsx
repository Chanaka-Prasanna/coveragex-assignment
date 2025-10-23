"use client";

import { Task } from "@/types";
import { createTask, fetachTasks, updateTask } from "@/utils/db/tasks";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      const newTask: Task = {
        id: uuidv4().toString(),
        title: title.trim(),
        description: description.trim(),
        is_completed: false,
      };

      try {
        await createTask(newTask);
        await fetchData();
      } catch (error) {
        console.error("Error creating task:", error);
      }
      setTitle("");
      setDescription("");
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await updateTask({
        id,
        is_completed: !tasks.find((task) => task.id === id)?.is_completed,
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const fetchData = async () => {
    try {
      const { success, data } = await fetachTasks();
      if (success) {
        setTasks(data.filter((task: Task) => !task.is_completed));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 bg-white"
                    placeholder=""
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 bg-white resize-y"
                    placeholder=""
                  />
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
          <div className="pl-10 w-[36rem]">
            <div className="space-y-5 py-6 max-w-xl">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-200 rounded-lg p-4 transition-all duration-300 ${
                    task.is_completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          task.is_completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          task.is_completed ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {task.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`px-5 py-1.5 rounded border border-gray-400 font-medium transition-colors whitespace-nowrap ${
                        task.is_completed
                          ? "bg-gray-300 text-gray-700"
                          : "bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Done"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
