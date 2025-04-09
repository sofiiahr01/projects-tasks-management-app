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
    addTask(task: Task) {
      this.tasks.push(task);
      this.nextId++;
      this.saveTasks();
    },

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

    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    updateTask(task: Task) {
      const index = this.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = task;
        this.saveTasks();
      }
    },

    removeTask(taskId: number) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.saveTasks();
    },
  },
});
