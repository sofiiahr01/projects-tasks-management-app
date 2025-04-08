// src/stores/taskStore.ts
import { defineStore } from "pinia";

interface Task {
  id: number;
  name: string;
  worker: string;
  status: string;
  createdAt: string;
}

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
    nextId: 1,
  }),

  actions: {
    // Додавання задачі
    addTask(task: Task) {
      this.tasks.push(task);
      this.nextId++;
      this.saveTasks();
    },

    // Завантаження задач з localStorage
    loadTasks() {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        this.tasks = tasks;
        this.nextId = tasks.length
          ? Math.max(...tasks.map((task: Task) => task.id)) + 1
          : 1;
      }
    },

    // Збереження задач в localStorage
    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    // Оновлення задачі
    updateTask(task: Task) {
      const index = this.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = task;
        this.saveTasks();
      }
    },

    // Видалення задачі
    removeTask(taskId: number) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.saveTasks();
    },
  },
});
