import { defineStore } from "pinia";

export interface Project {
  id: number;
  name: string;
  tasks: any[];
  taskCount: number;
  status: string;
  createdAt: string;
}

export const useProjectStore = defineStore("projectStore", {
  state: () => ({
    projects: [] as Project[],
    nextId: 1,
  }),
  getters: {
    filteredProjects: (state) => {
      return (filterName: string, filterStatus: string) => {
        return state.projects.filter((project) => {
          const matchesName = project.name
            .toLowerCase()
            .includes(filterName.toLowerCase());
          const matchesStatus = filterStatus
            ? project.status === filterStatus
            : true;
          return matchesName && matchesStatus;
        });
      };
    },
    taskCount: (state) =>
      state.projects.map((project) => ({
        id: project.id,
        taskCount: project.taskCount || 0,
      })),
  },
  actions: {
    loadFromLocalStorage() {
      const saved = localStorage.getItem("projects");
      if (saved) {
        this.projects = JSON.parse(saved);
        this.nextId = this.projects.length
          ? Math.max(...this.projects.map((p) => p.id)) + 1
          : 1;
      }
    },
    saveToLocalStorage() {
      localStorage.setItem("projects", JSON.stringify(this.projects));
    },
    addProject(name: string) {
      if (!name.trim()) return;
      this.projects.push({
        id: this.nextId++,
        name,
        tasks: [],
        taskCount: 0,
        status: "",
        createdAt: "",
      });
      this.saveToLocalStorage();
    },
  },
});
