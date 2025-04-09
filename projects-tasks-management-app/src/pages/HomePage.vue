<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onMounted, reactive, watch, ref, computed } from "vue";
import axios from "axios";
import ProjectPage from "./pages/ProjectPage.vue";
import Modal from "../components/Modal.vue";
import { useProjectStore } from "../store/projectStore";
const store = useProjectStore();

const addProject = () => {
  store.addProject(projectName.value);
  projectName.value = "";
  isModalOpen.value = false;
};

interface Row {
  id: number;
  name: string;
  tasks: number;
  status: string;
  createdAt: string;
}

const minWidths = [80, 200, 100, 100, 130];
const columnWidths = ref<number[]>([80, 200, 100, 100, 130]);
const resizingCol = ref<number | null>(null);
const startX = ref(0);
const startWidth = ref(0);

const headers = [
  ref<HTMLElement | null>(null),
  ref<HTMLElement | null>(null),
  ref<HTMLElement | null>(null),
  ref<HTMLElement | null>(null),
  ref<HTMLElement | null>(null),
];

const idHeader = headers[0];
const nameHeader = headers[1];
const tasksHeader = headers[2];
const statusHeader = headers[3];
const createdAtHeader = headers[4];

const WIDTHS_KEY = "vue-table-column-widths";
const saveWidthsToLocalStorage = () => {
  localStorage.setItem(WIDTHS_KEY, JSON.stringify(columnWidths.value));
};

const startResize = (event: MouseEvent, index: number) => {
  resizingCol.value = index;
  startX.value = event.clientX;
  startWidth.value = headers[index].value?.offsetWidth || 0;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", stopResize);
};

const onMouseMove = (event: MouseEvent) => {
  if (resizingCol.value !== null) {
    const delta = event.clientX - startX.value;
    const newWidth = startWidth.value + delta;
    if (newWidth >= minWidths[resizingCol.value]) {
      columnWidths.value[resizingCol.value] = newWidth;
      updateWidths();
      saveWidthsToLocalStorage();
    }
  }
};

const stopResize = () => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", stopResize);
  resizingCol.value = null;
};

const updateWidths = () => {
  headers.forEach((header, i) => {
    const th = header.value;
    if (th) th.style.width = columnWidths.value[i] + "px";
  });
};

const sortField = ref<string>("id");

const sortByField = () => {
  projects.value.sort((a, b) => {
    const aValue = a[sortField.value as keyof Project];
    const bValue = b[sortField.value as keyof Project];

    if (sortField.value === "tasks") {
      return b.taskCount - a.taskCount;
    } else {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    }
    return 0;
  });
};

const filterName = ref("");
const filterStatus = ref("");

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    const matchesName = project.name
      .toLowerCase()
      .includes(filterName.value.toLowerCase());
    const matchesStatus = filterStatus.value
      ? project.status === filterStatus.value
      : true;
    return matchesName && matchesStatus;
  });
});

interface Project {
  id: number;
  name: string;
  tasks: any[];
  taskCount: number;
  status: string;
  createdAt: string;
}

const projects = ref<Project[]>([]);
const projectName = ref("");
const isModalOpen = ref(false);
const nextId = ref(1);

const taskCount = computed(() => {
  return projects.value.map((project) => ({
    id: project.id,
    taskCount: project.taskCount || 0,
  }));
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(() => {
  store.loadFromLocalStorage();

  const savedProjects = localStorage.getItem("projects");
  if (savedProjects) {
    projects.value = JSON.parse(savedProjects);
    nextId.value = projects.value.length
      ? Math.max(...projects.value.map((p) => p.id)) + 1
      : 1;
  }

  const savedWidths = localStorage.getItem(WIDTHS_KEY);
  if (savedWidths) {
    try {
      const parsed = JSON.parse(savedWidths);
      if (Array.isArray(parsed)) {
        columnWidths.value = parsed;
      }
    } catch (e) {
      console.error("Не вдалося прочитати ширину колонок з localStorage");
    }
  }

  updateWidths();
});

watch(
  projects,
  (newProjects) => {
    localStorage.setItem("projects", JSON.stringify(newProjects));
  },
  { deep: true }
);
</script>

<template>
  <div class="table-wrap">
    <div class="sort-container">
      <div class="sort-item">
        <label for="filterStatus">Фільтр:</label>
        <select id="filterStatus" v-model="filterStatus">
          <option value="">Всі</option>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="sort-item">
        <label for="sortField">Сортувати за:</label>
        <select id="sortField" v-model="sortField" @change="sortByField">
          <option value="id">ID</option>
          <option value="name">Назва проєкту</option>
          <option value="tasks">Кількість завдань</option>
          <option value="status">Статус</option>
        </select>
      </div>
      <div class="sort-item">
        <label for="filterName">Пошук</label>
        <input
          type="text"
          id="filterName"
          v-model="filterName"
          placeholder="Введіть назву проєкту"
        />
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th ref="idHeader" @mousedown="startResize($event, 0)">id</th>
          <th ref="nameHeader" @mousedown="startResize($event, 1)">
            Назва проєкту
          </th>
          <th ref="tasksHeader" @mousedown="startResize($event, 2)">
            Кількість завдань
          </th>
          <th ref="statusHeader" @mousedown="startResize($event, 3)">Статус</th>
          <th ref="createdAtHeader" @mousedown="startResize($event, 4)">
            Дата створення
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in filteredProjects" :key="project.id">
          <td>{{ project.id }}</td>
          <td>
            <router-link :to="`/project/${project.id}`">{{
              project.name
            }}</router-link>
          </td>
          <td>
            {{
              taskCount.find((item) => item.id === project.id)?.taskCount || 0
            }}
          </td>
          <td>
            <select v-model="project.status">
              <option value="">--</option>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </td>
          <td>
            <input type="date" v-model="project.createdAt" />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="openModal" class="open-modal">Додати проєкт</button>
    <Modal :isVisible="isModalOpen" @close="closeModal" class="modal">
      <label for="name" class="input-name">Назва проєкту</label>
      <input type="text" v-model="projectName" id="name" required />
      <label for="description" class="input-name">Опис проєкту</label>
      <textarea id="description"></textarea>
      <button @click="addProject">Зберегти</button>
    </Modal>
  </div>
</template>

<style scoped>
.table-wrap {
  width: 100%;
  overflow-x: auto;
  position: relative;
  text-align: right;
}

table {
  max-width: 700px;
  table-layout: fixed;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #dad5c6;
  border-spacing: 0;
  margin: 20px auto;
}

thead {
  background-color: #dad5c6;
  border: 1px solid #dad5c6;
  text-align: center;
}

th {
  color: #232e3f;
  font-family: "Monterrat", sans-serif;
  font-weight: 400;
  padding: 10px;
  position: relative;
  cursor: col-resize;
  user-select: none;
}

thead th {
  border: none;
}

td {
  padding: 10px;
  border: 1px solid #dad5c6;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  text-align: center;
  position: relative;
}

select {
  background-color: #fafafa;
  border: none;
  color: #232e3f;
}

button {
  background-color: #cf9421;
  color: #fafafa;
  font-family: "Monterrat", sans-serif;
  font-weight: 400;
  border-radius: 10px;
  padding: 10px;
  border: none;
  cursor: pointer;
}

label {
  padding-right: 5px;
  align-self: flex-start;
}

input,
textarea {
  background-color: #eeece3;
  border: 2px solid #dad5c6;
  border-radius: 5px;
}

.modal input {
  margin-bottom: 10px;
}

.modal button {
  margin-top: 10px;
}

.input-name {
  color: #232e3f;
  font-family: "Monterrat", sans-serif;
  font-weight: 300;
  font-size: 15px;
}

.sort-container {
  display: flex;
  justify-content: space-between;
}

.sort-item {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
}
</style>
