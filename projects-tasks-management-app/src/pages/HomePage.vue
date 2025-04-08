<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onMounted, reactive, watch, ref } from "vue";
import ProjectPage from "./pages/ProjectPage.vue";
import Modal from "../components/Modal.vue";

onMounted(() => {
  const savedProjects = localStorage.getItem("projects");
  if (savedProjects) {
    projects.value = JSON.parse(savedProjects);
    nextId.value = projects.value.length
      ? Math.max(...projects.value.map((p) => p.id)) + 1
      : 1;
  }
});

interface Row {
  id: number;
  name: string;
  tasks: number;
  tasks: number | string;
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

onMounted(() => {
  const saved = localStorage.getItem(WIDTHS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        columnWidths.value = parsed;
      }
    } catch (e) {
      console.error("Не вдалося прочитати ширину колонок з localStorage");
    }
  }

  updateWidths();
});

interface Project {
  id: number;
  name: string;
  tasks: number | string;
  status: string;
  createdAt: string;
}

const projects = ref<Project[]>([]);
const projectName = ref("");
const isModalOpen = ref(false);
const nextId = ref(1);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const addProject = () => {
  if (!projectName.value.trim()) return;

  projects.value.push({
    id: nextId.value++,
    name: projectName.value,
    tasks: "",
    status: "",
    createdAt: "",
  });

  projectName.value = "";
  isModalOpen.value = false;
};

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
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.id }}</td>
          <td>
            <router-link :to="`/project/${project.id}`">{{
              project.name
            }}</router-link>
          </td>
          <td contenteditable="true">{{ project.tasks }}</td>
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
  border-collapse: collapse;
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
</style>
